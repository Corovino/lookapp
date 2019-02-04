import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the LetterPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'letter',
})
export class LetterPipe implements PipeTransform {

  transform(value: string, ...args) {
    return value.length > args[0] ? value.substring(0, args[0]) + '...' : value;
  }

}
