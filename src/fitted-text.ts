/*
	FittedText

	Horizontally squishes text to a specific width
	A VanillaJS alternative to https://github.com/SupportClass/sc-fitted-text

	Written by Inkfarer - https://inkfarer.com
*/

type FittedTextAlign = 'left' | 'center' | 'right';

class FittedText extends HTMLElement {
    fittedContent: HTMLDivElement;

    constructor() {
        super();
        this.fittedContent = document.createElement('div');
    }

    connectedCallback() {
        const align: string = this.getAttribute('align') || 'left';
        this.innerHTML = '';
        this.setAttribute('style', this.removeLineBreaks(`
			display: flex;
			position: relative;
			white-space: nowrap;
			max-width: ${this.maxWidth > 0 ? this.maxWidth + 'px' : 'unset'};
			justify-content: ${this.getJustify(align)}
		`));
        this.fittedContent.setAttribute('style', this.removeLineBreaks(`
			transform-origin: ${align} center;
			text-align: ${align};
		`));
        this.appendChild(this.fittedContent);
        this.setTransform();
    }

	static get observedAttributes() { return ['text', 'max-width', 'align', 'use-inner-html']; }

    attributeChangedCallback(name: any, oldValue: any, newValue: any) {
        switch (name) {
            case 'text':
                this.setText();
                this.setTransform();
                return;
            case 'max-width':
                if (oldValue) {
                    this.style.maxWidth = `${this.maxWidth > 0 ? this.maxWidth + 'px' : 'unset'}`;
                    this.setTransform();
                }
                return;
            case 'align':
                this.style.justifyContent = this.getJustify(newValue);
                this.fittedContent.style.textAlign = newValue;
                this.fittedContent.style.transformOrigin = `${newValue} center`;
                return;
            case 'use-inner-html':
                this.setText();
                this.setTransform();
                return;
        }
    }

    setText() {
        if (this.useInnerHTML) {
            this.fittedContent.innerHTML = this.text;
        } else {
            this.fittedContent.innerText = this.text;
        }
    }

    setTransform() {
        if (this.maxWidth <= 0) return;
        const scrollWidth = this.fittedContent.scrollWidth;
        if (scrollWidth > this.maxWidth) {
            this.fittedContent.style.transform = `scaleX(${this.maxWidth / scrollWidth})`;
        } else {
            this.fittedContent.style.transform = 'scaleX(1)';
        }
    }

    getJustify(align: string): string {
        switch (align) {
            case 'center':
                return 'center';
            case 'right':
                return 'flex-end';
            default:
                return 'unset';
        }
    }

    get text(): string {
        return this.getAttribute('text') || '';
    }

    set text(newValue: string) {
        this.setAttribute('text', newValue);
    }

    get maxWidth(): number {
        const attr = parseInt(this.getAttribute('max-width') || '');
        return isNaN(attr) ? -1 : attr;
    }

    set maxWidth(newValue: number) {
        this.setAttribute('max-width', String(newValue));
    }

    get useInnerHTML(): boolean {
        return this.hasAttribute('use-inner-html');
    }

    set useInnerHTML(newValue: boolean) {
        if (newValue) {
            this.setAttribute('use-inner-html', '');
        } else {
            this.removeAttribute('use-inner-html');
        }
    }

    get align(): FittedTextAlign {
        return this.getAttribute('align') as FittedTextAlign;
    }

    set align(newValue: FittedTextAlign) {
        this.setAttribute('align', newValue);
    }

    removeLineBreaks(input: string): string {
        return input.replace(/\s+/g, ' ').trim();
    }
}

customElements.define('fitted-text', FittedText);
