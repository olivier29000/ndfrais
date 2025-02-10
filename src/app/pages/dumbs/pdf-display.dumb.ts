import { CommonModule } from '@angular/common';
import { Component, computed, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'dumb-pdf-display',
  standalone: true,
  imports: [CommonModule],
  // standalone: true,

  // imports: [CommonModule, TranslateModule],
  template: `<div class="pdf-viewer">
    @if (pdfData) {
      <object [data]="pdfData" type="application/pdf">
        <p>
          Your browser does not support PDFs. Download the PDF to view it:
          <a href="example.pdf">Download PDF</a>.
        </p>
      </object>
    } @else {
      <h1>no data</h1>
    }
  </div>`,
  styles: [
    `
      object {
        width: 100%;
        height: 70vh;
      }
    `
  ]
})
export class PdfDisplayDumb {
  @Input() pdfData!: SafeResourceUrl;
  currentPage = 1;
  totalPages = 1;
  constructor(private sanitizer: DomSanitizer) {}

  getPdfTotalPages(): number {
    // Implement logic to get the total number of pages from the PDF data
    return 10; // Replace with the actual total pages count
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
}
