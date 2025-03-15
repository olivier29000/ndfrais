import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Tag } from 'src/app/models/tag.model';

@Component({
  selector: 'dumb-tag-group',
  template: `
    <div class="card">
      <div class="card-body">
        <div class="flex">
          <h4 class="me-2">{{ tagName }}</h4>
          @if (canAdd) {
            <a
              (click)="addTag(tagList[0])"
              (keydown.enter)="addTag(tagList[0])"
              tabindex="0"
              class="label label-light m-1"
              [ngStyle]="{ color: tagList[0].color, border: 'thin solid' }">
              <i class=" fas fa-solid fa-plus"></i
            ></a>
          }
        </div>

        <div class="flex flex-wrap">
          @if (tagList && tagList.length > 0) {
            @for (tag of tagList; track tag) {
              <a
                class="label label-light m-1"
                (click)="selectTag(tag)"
                (keydown.enter)="selectTag(tag)"
                tabindex="0"
                [ngStyle]="{ color: tagList[0].color, border: 'thin solid' }">
                {{ tag.title }}</a
              >
            }
          }
        </div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [CommonModule]
})
export class TagGroupDumbComponent {
  @Input() tagName!: string;
  @Input() tagList!: Tag[] | Tag[];
  @Input() canAdd = false;
  @Output() addTagOutput = new EventEmitter<Tag>();

  addTag(tag: Tag) {
    this.addTagOutput.emit(tag);
  }

  @Output() selectTagOutput = new EventEmitter<Tag>();
  selectTag(tag: Tag) {
    this.selectTagOutput.emit(tag);
  }
}
