import { CommonModule } from '@angular/common';
import { Component, Directive, Input, NgModule } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { OrganizationChartModule } from 'primeng/organizationchart';
@Component({
  selector: 'dumb-organigramme',
  template: `
    <div>
      <p-organizationChart [value]="data" [collapsible]="true">
        <ng-template let-node pTemplate="default">
          <div class="p-2 text-center">
            <div class="p-2">
              {{ node.label }}
            </div>
          </div>
        </ng-template>
      </p-organizationChart>
    </div>
  `,
  styles: [
    `
      :host ::ng-deep .p-organizationchart .p-organizationchart-line-down {
        background: black !important;
      }
      :host ::ng-deep .p-organizationchart .p-organizationchart-line-left {
        border-right: 1px solid black !important;
        border-color: black !important;
      }
      :host ::ng-deep .p-organizationchart .p-organizationchart-line-top {
        border-top: 1px solid black !important;
        border-color: black !important;
      }
      :host ::ng-deep .p-organizationchart .p-organizationchart-node-content {
        border: 1px solid black !important;
        background: #ffffff !important;
        color: #4b5563 !important;
        padding: 1.25rem !important;
      }
    `
  ],
  standalone: true,
  imports: [CommonModule, OrganizationChartModule]
})
export class OrganigrammeDumb {
  @Input() data!: TreeNode[];
}
