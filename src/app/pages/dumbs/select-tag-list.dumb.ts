import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Tag } from 'src/app/models/tag.model';
import { NewTagDumb } from './new-tag-dumb';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'dumb-select-tag',
  template: `
    <div class="border rounded mt-4 p-2 pr-8 relative">
      <table class="w-full truncate table-fixed">
        <thead>
          <tr>
            <th class="font-medium"></th>
            <th class="font-medium">disponibles</th>
            <th class="font-medium">sélectionnés</th>
          </tr>
        </thead>
        <tbody>
          @for (
            availableTagMap of _availableTagList | keyvalue;
            track availableTagMap
          ) {
            <tr>
              <td>
                <div class="flex">
                  <span>{{ availableTagMap.key }}</span>

                  <button
                    class="flex-none"
                    mat-flat-button
                    type="button"
                    (click)="addTag(availableTagMap.value[0])">
                    <mat-icon
                      class="icon-xs"
                      svgIcon="mat:control_point"></mat-icon>
                  </button>
                </div>
              </td>
              <td>
                <div class="flex  flex-wrap">
                  @for (
                    tag of _availableTagListToSelect[availableTagMap.key];
                    track availableTagList
                  ) {
                    <a
                      (click)="selectTag(tag)"
                      (keydown.enter)="selectTag(tag)"
                      tabindex="0"
                      class="label label-light m-1 p-2"
                      [ngStyle]="{ color: tag.color, border: '1px solid' }">
                      {{ tag.title }}
                    </a>
                  }
                </div>
              </td>
              <td class="font-medium">
                <div class="flex flex-wrap">
                  @for (
                    tag of _selectedTagMap[availableTagMap.key];
                    track availableTagList
                  ) {
                    <a
                      (click)="unSelectTag(tag)"
                      (keydown.enter)="unSelectTag(tag)"
                      tabindex="0"
                      class="label label-light m-1 p-2"
                      [ngStyle]="{ color: tag.color, border: '1px solid' }">
                      {{ tag.title }}
                    </a>
                  }
                </div>
              </td>
            </tr>
            @if (
              newTagAction && newTagAction.colorName === availableTagMap.key
            ) {
              <tr>
                <td colspan="3" class="text-center">
                  <dumb-edit-create-tag
                    [tag]="newTagAction"
                    (validTagOutput)="createTag($event)"
                    (cancelOutput)="cancelTag()"></dumb-edit-create-tag>
                </td>
              </tr>
            }
          }
          <tr>
            @if (newTagAction && newTagAction.colorName === '') {
              <td colspan="3" class="text-center">
                <dumb-edit-create-tag
                  [tag]="newTagAction"
                  (validTagOutput)="createTag($event)"
                  (cancelOutput)="cancelTag()"></dumb-edit-create-tag>
              </td>
            } @else {
              <td colspan="1" class="text-center">
                <button
                  color="primary"
                  mat-flat-button
                  type="submit"
                  (click)="newTag()">
                  Nouveau
                </button>
              </td>
              <td colspan="2" class="text-center"></td>
            }
          </tr>
        </tbody>
      </table>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, NewTagDumb, MatButtonModule, MatIconModule]
})
export class SelectTagDumb {
  newTagAction: Tag | undefined = undefined;

  _availableTagList: Record<string, Tag[]> = {};
  _availableTagListToSelect: Record<string, Tag[]> = {};

  @Input()
  set availableTagList(value: Record<string, Tag[]>) {
    this._availableTagList = value;
    this._availableTagListToSelect = this.makeAvailableTagListMap(
      value,
      this.selectedTagList
    );
  }
  get availableTagListToSelect(): Record<string, Tag[]> {
    return this._availableTagListToSelect;
  }

  _selectedTagList: Tag[] = [];
  _selectedTagMap: Record<string, Tag[]> = {};
  @Input()
  set selectedTagList(value: Tag[]) {
    this._selectedTagList = value;
    this._availableTagListToSelect = this.makeAvailableTagListMap(
      this._availableTagList,
      value
    );
    this._selectedTagMap = Object.keys(this._availableTagList).reduce(
      (acc, colorName) => {
        acc[colorName] = value.filter((t) => t.colorName === colorName);
        return acc;
      },
      {} as Record<string, Tag[]>
    );
  }
  get selectedTagList(): Tag[] {
    return this._selectedTagList;
  }

  @Output() selectTagOutput = new EventEmitter<Tag>();
  @Output() unSelectTagOutput = new EventEmitter<Tag>();
  @Output() createTagOutput = new EventEmitter<Tag>();

  newTag(): void {
    this.newTagAction = {
      title: '',
      color: '#000000',
      colorName: ''
    };
  }

  cancelTag(): void {
    this.newTagAction = undefined;
  }

  addTag(tag: Tag): void {
    this.newTagAction = {
      title: '',
      color: tag.color,
      colorName: tag.colorName
    };
  }

  createTag(tag: Tag): void {
    this.createTagOutput.emit(tag);
    this.newTagAction = undefined;
  }

  makeAvailableTagListMap(
    tagListMap: Record<string, Tag[]>,
    selectedTagList: Tag[]
  ): Record<string, Tag[]> {
    return Object.entries(tagListMap).reduce(
      (acc, [title, tagList]) => {
        tagList = tagList.filter(
          (t) => !selectedTagList.some((tag) => tag.id === t.id)
        );
        if (tagList.length > 0) {
          acc[title] = tagList;
        }
        return acc;
      },
      {} as Record<string, Tag[]>
    );
  }

  unSelectTag(tag: Tag) {
    this.unSelectTagOutput.emit(tag);
  }
  selectTag(tag: Tag) {
    this.selectTagOutput.emit(tag);
  }
}
