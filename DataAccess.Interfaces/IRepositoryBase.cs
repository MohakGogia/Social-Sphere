namespace DataAccess.Interfaces;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using EntityContract;
using Microsoft.EntityFrameworkCore.Query;

public interface IRepositoryBase<TEntity> where TEntity : BaseEntity
{
    Task AddDbSetWithoutSaveAsync(TEntity entity, CancellationToken cancellationToken = default);
    Task AddDbSetWithSaveAsync(TEntity entity, CancellationToken cancellationToken = default);
    Task SaveDbSetChangesAsyncWithPreInitializedAuditInfo(TEntity entity, CancellationToken cancellationToken = default);
    Task AddRangeDbSetAsync(params TEntity[] entities);
    void AddRangeDbSetWithoutSave(params TEntity[] entities);
    void UpdateDbSet(TEntity entity);
    Task UpdateDbSetRangeAsync(params TEntity[] entities);
    IQueryable<TEntity> GetAll();
    Task<List<TEntity>> GetAll(Expression<Func<TEntity, bool>> predicate,
                                   Expression<Func<TEntity, TEntity>>? selector = null,
                                   Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>>? orderBy = null,
                                   Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>>? include = null,
                                   bool disableTracking = true);

    Task<TEntity> GetById(int id);
    Task Create(TEntity entity);
    Task CreateWithoutSave(TEntity entity);
    Task Update(TEntity entity);
    Task Delete(int id);
    void DeleteWithoutSave(TEntity entity);
    Task DeleteWithoutSave(int id);
    Task DeleteDBSetRangeAsync(params TEntity[] entities);
    Task<int> GetTotalCountAsync();
    Task<int> GetTotalCountAsync(Expression<Func<TEntity, bool>> predicate, CancellationToken cancellationToken = default);
    Task<List<TEntity>> Find(Expression<Func<TEntity, bool>> pred);
    Task<List<TEntity>> FindAndSelectWithoutTracking(Expression<Func<TEntity, bool>> pred, Expression<Func<TEntity, TEntity>> expression);
    Task<List<TEntity>> FindWithoutTracking(Expression<Func<TEntity, bool>> pred);
    void UpdateDbSetRangeWithoutSave(params TEntity[] entities);
    Task DeleteWhere(Expression<Func<TEntity, bool>> pred);
    Task SaveChangesAsync();
    void DeleteDBSetRangeWithoutSave(params TEntity[] entities);
    Task DeleteWhereWithoutSave(Expression<Func<TEntity, bool>> pred);
    Task<TEntity> GetFirstOrDefault(Expression<Func<TEntity, bool>> predicate,
                                    Expression<Func<TEntity, TEntity>>? selector = null,
                                    Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>>? orderBy = null,
                                    Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>>? include = null,
                                    bool disableTracking = true);
    bool IsExists(Expression<Func<TEntity, bool>> predicate);
    bool IsExists(Expression<Func<TEntity, bool>> predicate,
                Expression<Func<TEntity, TEntity>>? selector = null,
                Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>>? orderBy = null,
                Func<IQueryable<TEntity>, IIncludableQueryable<TEntity, object>>? include = null,
                bool disableTracking = true);
    void UpdateWithoutSave(TEntity entity);
    /// <summary>
    /// This method is used to update any particular entry on the basis of passed list of  property
    /// Note method works only on root level property i.e, will not work on nested property
    /// </summary>
    void UpdateWithoutSave(TEntity entity, params Expression<Func<TEntity, object>>[] properties);
}
