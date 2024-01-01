namespace DataAccess;

using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Threading.Tasks;
using DataAccess.Interfaces;
using EntityContract;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;

public class RepositoryBase<TEntity> : IRepositoryBase<TEntity> where TEntity : BaseEntity
{
    public readonly SocialSphereDBContext _dbContext;
    protected readonly DbSet<TEntity> _dbSet;

    public RepositoryBase(SocialSphereDBContext dbContext)
    {
        _dbContext = dbContext;
        _dbSet = _dbContext.Set<TEntity>();
    }

    public async Task AddDbSetWithoutSaveAsync(TEntity entity, CancellationToken cancellationToken = default)
    {
        await _dbSet.AddAsync(entity, cancellationToken);
    }

    public async Task SaveDbSetChangesAsyncWithPreInitializedAuditInfo(TEntity entity, CancellationToken cancellationToken = default)
    {
        await _dbSet.AddAsync(entity, cancellationToken);
        await _dbContext.SaveChangesAsyncWithPreInitializedAuditInfo();
    }

    public async Task AddDbSetWithSaveAsync(TEntity entity, CancellationToken cancellationToken = default)
    {
        await _dbSet.AddAsync(entity, cancellationToken);
        await _dbContext.SaveChangesAsync();
    }

    public async Task AddRangeDbSetAsync(params TEntity[] entities)
    {
        await _dbSet.AddRangeAsync(entities);
        await _dbContext.SaveChangesAsync();
    }

    public void AddRangeDbSetWithoutSave(params TEntity[] entities)
    {
        _dbSet.AddRange(entities);
    }

    public void UpdateDbSet(TEntity entity)
    {
        _dbSet.Update(entity);
    }

    public async Task UpdateDbSetRangeAsync(params TEntity[] entities)
    {
        _dbSet.UpdateRange(entities);
        await _dbContext.SaveChangesAsync();
    }

    public void UpdateDbSetRangeWithoutSave(params TEntity[] entities)
    {
        _dbSet.UpdateRange(entities);
    }

    public IQueryable<TEntity> GetAll()
    {
        return _dbContext.Set<TEntity>().AsNoTracking();
    }

    public async Task<List<TEntity>> GetAll(Expression<Func<TEntity, bool>> predicate,
                                   Expression<Func<TEntity, TEntity>> selector = null,
                                   Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
                                   Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null,
                                   bool disableTracking = true)
    {
        IQueryable<TEntity> query = _dbSet.AsQueryable();

        if (disableTracking)
        {
            query = query.AsNoTracking();
        }

        if (include != null)
        {
            query = include(query);
        }

        if (predicate != null)
        {
            query = query.Where(predicate);
        }

        if (orderBy != null)
        {
            query = orderBy(query);
        }

        if (selector != null)
        {
            query = query.Select(selector);
        }

        return await query.ToListAsync();
    }

    public async Task<TEntity> GetById(int id)
    {
        return await _dbContext.Set<TEntity>()
                    .AsNoTracking()
                    .FirstOrDefaultAsync(e => e.Id == id);
    }

    public async Task Create(TEntity entity)
    {
        await _dbContext.Set<TEntity>().AddAsync(entity);
        await _dbContext.SaveChangesAsync();
    }

    public async Task CreateWithoutSave(TEntity entity)
    {
        await _dbContext.Set<TEntity>().AddAsync(entity);
    }

    public async Task Update(TEntity entity)
    {
        _dbContext.Set<TEntity>().Update(entity);
        await _dbContext.SaveChangesAsync();
    }

    public void UpdateWithoutSave(TEntity entity, params Expression<Func<TEntity, object>>[] properties)
    {
        foreach (var prop in properties)
        {
            _dbContext.Entry(entity).Property(prop).IsModified = true;
        }
    }

    public void UpdateWithoutSave(TEntity entity)
    {
        _dbContext.Set<TEntity>().Update(entity);
    }

    public async Task Delete(int id)
    {
        var entity = await GetById(id);
        _dbContext.Set<TEntity>().Remove(entity);
        await _dbContext.SaveChangesAsync();
    }
    public void DeleteWithoutSave(TEntity entity)
    {
        _dbContext.Set<TEntity>().Remove(entity);

    }
    public async Task DeleteWithoutSave(int id)
    {
        var entity = await GetById(id);
        _dbContext.Set<TEntity>().Remove(entity);

    }

    public Task DeleteDBSetRangeAsync(params TEntity[] entities)
    {
        _dbContext.Set<TEntity>().RemoveRange(entities);
        return _dbContext.SaveChangesAsync();
    }

    public void DeleteDBSetRangeWithoutSave(params TEntity[] entities)
    {
        _dbContext.Set<TEntity>().RemoveRange(entities);
    }

    public async Task DeleteWhere(Expression<Func<TEntity, bool>> pred)
    {
        var entityList = await _dbSet.Where(pred).ToListAsync();
        _dbContext.Set<TEntity>().RemoveRange(entityList);
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteWhereWithoutSave(Expression<Func<TEntity, bool>> pred)
    {
        var entityList = await _dbSet.Where(pred).ToListAsync();
        _dbContext.Set<TEntity>().RemoveRange(entityList);
    }

    public async Task<int> GetTotalCountAsync()
    {
        return await _dbSet.CountAsync();
    }

    public async Task<int> GetTotalCountAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellationToken = default)
    {
        return await _dbSet.CountAsync(predicate, cancellationToken);
    }


    protected DataTable CallStoredProc(string spName, Dictionary<string, object> parameters)
    {
        //TODO: Using Ado for now as EF giving the following Error The Include operation is not supported when calling a stored procedure.
        return PopulateDataTable(spName, parameters);
    }

    protected void CallUpdateStoredProc(string spName, Dictionary<string, object> parameters)
    {
        //TODO: Using Ado for now as EF giving the following Error The Include operation is not supported when calling a stored procedure.
        ExecuteSP(spName, parameters);
    }

    private DataTable PopulateDataTable(string spName, Dictionary<string, object> parameters)
    {
        DataTable dt = new DataTable();
        using (SqlConnection sqlConn = new SqlConnection(_dbContext.Database.GetDbConnection().ConnectionString))
        {

            using (SqlCommand sqlCmd = new SqlCommand(spName, sqlConn))
            {
                sqlCmd.CommandType = CommandType.StoredProcedure;
                foreach (var item in parameters)
                {
                    sqlCmd.Parameters.AddWithValue("@" + item.Key, item.Value);
                }
                sqlConn.Open();
                using (SqlDataAdapter sqlAdapter = new SqlDataAdapter(sqlCmd))
                {
                    sqlAdapter.Fill(dt);
                }
                sqlConn.Close();
            }
        }

        return dt;
    }

    public int GetCountFromSp(string spName, Dictionary<string, object> parameters)
    {
        DataTable dt = PopulateDataTable(spName, parameters);
        return Convert.ToInt32(dt.Rows[0].ItemArray[0]);
    }

    public async Task<List<TEntity>> Find(Expression<Func<TEntity, bool>> pred)
    {
        return await _dbSet.Where(pred).ToListAsync();
    }

    public async Task<List<TEntity>> FindAndSelectWithoutTracking(Expression<Func<TEntity, bool>> pred, Expression<Func<TEntity, TEntity>> expression)
    {
        return await _dbSet.Where(pred).Select(expression).AsNoTracking().ToListAsync();
    }

    public async Task<List<TEntity>> FindWithoutTracking(Expression<Func<TEntity, bool>> pred)
    {
        return await _dbSet.Where(pred).AsNoTracking().ToListAsync();
    }

    public async Task SaveChangesAsync()
    {
        await _dbContext.SaveChangesAsync();
    }

    ///// <summary>
    ///// Gets the first or default entity based on a predicate, orderby delegate and include delegate. This method default no-tracking query.
    ///// </summary>
    ///// <param name="selector">The selector for projection.</param>
    ///// <param name="predicate">A function to test each element for a condition.</param>
    ///// <param name="orderBy">A function to order elements.</param>
    ///// <param name="include">A function to include navigation properties</param>
    ///// <param name="disableTracking"><c>True</c> to disable changing tracking; otherwise, <c>false</c>. Default to <c>true</c>.</param>
    ///// <returns>An <see cref="IPagedList{TEntity}"/> that contains elements that satisfy the condition specified by <paramref name="predicate"/>.</returns>
    ///// <remarks>This method default no-tracking query.</remarks>
    public async Task<TEntity> GetFirstOrDefault(Expression<Func<TEntity, bool>> predicate,
                                                   Expression<Func<TEntity, TEntity>> selector = null,
                                                   Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
                                                   Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null,
                                                   bool disableTracking = true)
    {
        IQueryable<TEntity> query = _dbSet.AsQueryable();
        if (disableTracking)
        {
            query = query.AsNoTracking();
        }

        if (include != null)
        {
            query = include(query);
        }

        if (predicate != null)
        {
            query = query.Where(predicate);
        }

        if (orderBy != null)
        {
            query = orderBy(query);
        }

        if (selector != null)
        {
            query = query.Select(selector);
        }

        return await query.FirstOrDefaultAsync();
    }

    public bool IsExists(Expression<Func<TEntity, bool>> predicate)
    {
        return _dbSet.Count(predicate) > 0;
    }

    public bool IsExists(
        Expression<Func<TEntity, bool>> predicate,
                                                   Expression<Func<TEntity, TEntity>> selector = null,
                                                   Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
                                                   Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>> include = null,
                                                   bool disableTracking = true)
    {
        IQueryable<TEntity> query = _dbSet.AsQueryable();
        if (disableTracking)
        {
            query = query.AsNoTracking();
        }

        if (include != null)
        {
            query = include(query);
        }

        if (predicate != null)
        {
            query = query.Where(predicate);
        }

        if (orderBy != null)
        {
            query = orderBy(query);
        }

        if (selector != null)
        {
            query = query.Select(selector);
        }

        return query.Count(predicate) > 0;
    }

    protected DataSet CallStoredProcForMultipleTables(string spName, Dictionary<string, object> parameters)
    {
        return PopulateDataSet(spName, parameters);
    }

    private DataSet PopulateDataSet(string spName, Dictionary<string, object> parameters)
    {
        DataSet ds = new DataSet();
        using (SqlConnection sqlConn = new SqlConnection(_dbContext.Database.GetDbConnection().ConnectionString))
        {

            using (SqlCommand sqlCmd = new SqlCommand(spName, sqlConn))
            {
                sqlCmd.CommandType = CommandType.StoredProcedure;
                foreach (var item in parameters)
                {
                    sqlCmd.Parameters.AddWithValue("@" + item.Key, item.Value);
                }
                sqlConn.Open();
                using (SqlDataAdapter sqlAdapter = new SqlDataAdapter(sqlCmd))
                {
                    sqlAdapter.Fill(ds);
                }
                sqlConn.Close();
            }
        }

        return ds;
    }

    private void ExecuteSP(string spName, Dictionary<string, object> parameters)
    {
        using (SqlConnection sqlConn = new SqlConnection(_dbContext.Database.GetDbConnection().ConnectionString))
        {

            using (SqlCommand sqlCmd = new SqlCommand(spName, sqlConn))
            {
                sqlCmd.CommandType = CommandType.StoredProcedure;
                foreach (var item in parameters)
                {
                    sqlCmd.Parameters.AddWithValue("@" + item.Key, item.Value);
                }
                sqlConn.Open();

                sqlCmd.ExecuteNonQuery();
                sqlConn.Close();
            }
        }

    }

    public static List<T> MapToList<T>(DbDataReader dr)
    {
        var objList = new List<T>();
        var props = typeof(T).GetRuntimeProperties();
        var colMapping = dr.GetColumnSchema()
          .Where(x => props.Any(y => y.Name.ToLower() == x.ColumnName.ToLower()))
          .ToDictionary(key => key.ColumnName.ToLower());
        while (dr.Read())
        {
            T obj = Activator.CreateInstance<T>();
            foreach (var prop in props.Where(prop => colMapping.ContainsKey(prop.Name.ToLower())))
            {
                var val = dr.GetValue(colMapping[prop.Name.ToLower()].ColumnOrdinal.Value);
                prop.SetValue(obj, val == DBNull.Value ? null : val);
            }

            objList.Add(obj);
        }
        return objList;
    }
}
