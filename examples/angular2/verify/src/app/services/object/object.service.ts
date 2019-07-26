import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ObjectService {
  static copy(object) {
    return JSON.parse(JSON.stringify(object));
  }
}
