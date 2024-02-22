import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client/http-client.service';
import { ConfigurationService } from '../configuration/configuration.service';
import { Observable, switchMap } from 'rxjs';
import { PhotoDTO } from '../../interfaces/photo-dto';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  constructor(
    private httpClientService: HttpClientService,
    private configurationService: ConfigurationService,
  ) { }

  addPhoto(imgFile: File, userId: number, isProfilePhoto: boolean): Observable<PhotoDTO> {
    return this.httpClientService.sendMediaContent(this.configurationService.apiAddress + `/api/Image/add-photo?userId=${userId}&isProfilePhoto=${isProfilePhoto}`, imgFile);
  }

  deletePhoto(photoPublicId: string): Observable<string> {
    return this.httpClientService.delete(this.configurationService.apiAddress + `/api/Image/delete-photo?photoPublicId=${photoPublicId}`);
  }

  deleteAndAddPhoto(photoPublicId: string, imgFile: File, userId: number, isProfilePhoto: boolean): Observable<PhotoDTO> {
    return this.deletePhoto(photoPublicId).pipe(
      switchMap(() => this.addPhoto(imgFile, userId, isProfilePhoto))
    );
  }

  deletePhotoFromDatabase(id: number): Observable<unknown> {
    return this.httpClientService.delete(this.configurationService.apiAddress + `/api/Image/delete-photo-from-db/${id}`);
  }

}
