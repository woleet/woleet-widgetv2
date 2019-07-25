import { Component } from '@angular/core';

export const PREFIX = '--';

@Component({
	selector: 'sass-helper',
	template: '<div></div>',
	styleUrls: ['./sass-helper.component.scss']
})
export class SassHelperComponent {
	constructor() {
	}

	readProperty(name: string): string {
		let bodyStyles = window.getComputedStyle(document.body);

		console.log('bodyStyles', document.body);

		return bodyStyles.getPropertyValue(PREFIX + name);
	}
}
