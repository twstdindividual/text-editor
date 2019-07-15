import { Inject, Injectable} from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Word } from './word';
import { DOCUMENT } from '@angular/common';

@Injectable()
export class TextService {
  selectionRange: Range;
  constructor(
    private httpClient: HttpClient,
    @Inject(DOCUMENT) private document: Document
  ) {}

  getMockText() {
    return new Promise<string>(function (resolve) {
      resolve('A year ago I was in the audience at a gathering of designers in San Francisco. ' +
        'There were four designers on stage, and two of them worked for me. I was there to support them. ' +
        'The topic of design responsibility came up, possibly brought up by one of my designers, I honestly don’t remember the details. ' +
        'What I do remember is that at some point in the discussion I raised my hand and suggested, to this group of designers, ' +
        'that modern design problems were very complex. And we ought to need a license to solve them.');
    });
  }

  getSynonyms(word): Observable<Word[]> {
    return this.httpClient.get<Word[]>(`https://api.datamuse.com/words?rel_syn=${word}`);
  }

  toggleAction(actionName: string) {
    this.document.execCommand(actionName, false, '');
  }

  changeColor() {
    const color: string = prompt('Enter your color hex (#fafafa):');
    document.execCommand('foreColor', false, color);
  }

  saveSelection() {
    const documentSel = (this.document as any).selection;
    if (window.getSelection) {
      const sel = window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        return sel.getRangeAt(0);
      }
    } else if (documentSel && documentSel.createRange) {
      return documentSel.createRange();
    }
    return null;
  }

  restoreSelection(range) {
    if (range) {
      if (window.getSelection) {
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      } else if ((this.document as any).selection && range.select) {
        range.select();
      }
    }
  }
}
