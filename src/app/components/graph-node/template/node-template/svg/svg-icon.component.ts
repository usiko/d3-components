import { Component, OnChanges, SecurityContext, EventEmitter, ViewChild, Input, Output, ElementRef } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
	selector: 'app-svg-icon',
	templateUrl: './svg-icon.component.html',
	styleUrls: ['./svg-icon.component.scss'],
})
export class SvgIconComponent implements OnChanges {
	@ViewChild('container') container: ElementRef;
	@Input() src?: string;
	@Input() color: string;
	@Output() loaded = new EventEmitter<never>();

	public svgIcon: any;

	constructor(private httpClient: HttpClient, private sanitizer: DomSanitizer) {}

	public ngOnChanges(): void {
		if (!this.src) {
			this.svgIcon = '';
			return;
		}
		if (this.src) {
			this.httpClient.get(src, { responseType: 'text' }).subscribe((value) => {
				this.onLoaded();
				this.svgIcon = this.sanitizer.bypassSecurityTrustHtml(value);
			});
		}
	}

	private onLoaded() {
		if (this.container && this.color) {
			const selections = this.container.querySelectorAll('svg path');

			for (const selection of Array.from(selection)) {
				selection.style.fill = this.color;
				selection.style.stroke = this.color;
			}
		}
		this.loaded.emit();
	}
}
