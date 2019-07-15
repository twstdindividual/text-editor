import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { TextService } from '../text-service/text.service';
import { Word } from '../text-service/word';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileComponent implements OnInit {
  text$: Promise<string>;
  synonyms: Word[] = [];

  constructor(
    public textService: TextService,
    private changeDetectorRef: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document
  ) {
  }

  ngOnInit() {
    this.text$ = this.textService.getMockText();
  }

  fetchSynonyms() {
    this.textService.selectionRange = this.textService.saveSelection();
    const word: string = window.getSelection().toString();
    this.textService.getSynonyms(word).pipe(take(1)).subscribe(synonyms => {
      this.synonyms = synonyms;
      this.changeDetectorRef.detectChanges();
    });
  }

  replaceSelectedText(word: string) {
    (this.document.querySelector('.file') as any).focus();
    this.textService.restoreSelection(this.textService.selectionRange);
    this.document.execCommand('insertText', false, word);
    this.emptySynonyms();
  }

  emptySynonyms() {
    this.synonyms = [];
    this.changeDetectorRef.detectChanges();
  }
}
