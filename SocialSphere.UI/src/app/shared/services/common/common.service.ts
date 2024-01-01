/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { Dictionary } from 'src/app/core/interfaces/dictionary';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  /** This method is used to check null or undefined object type. */
  isNullOrUndefined(value: any) {
    return value === undefined || value === null;
  }

  /** This method is used to check empty value of a particular object. */
  isEmpty(value: any) {
    return value === '';
  }

  /** This method is used to remove extra white spaces. */
  removeExtraWhiteSpaces(text: string) {
    return text.replace(/\s{2,}/g, ' ').trim();
  }

  /** This method is used to check for an object type. */
  isObject(val: any) {
    return typeof val === 'object';
  }

  /** This method is used for deep copying an object. */
  deepCopy(value: any) {
    if (value) {
      return JSON.parse(JSON.stringify(value));
    }
    return value;
  }

  /** This method is used subscribe to a subscription. */
  subscribeToASubcription(subscriptions: Dictionary<Subscription>, key: string, subscription: Subscription) {
    subscriptions[key] = subscription;
  }

  /** This method is used unsubscribe to open subscriptions. */
  unsubscribeSubcriptions(subscriptions: Dictionary<Subscription>) {
    Object.keys(subscriptions).forEach(key => {
      subscriptions[key].unsubscribe();
    });
  }

}
