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
        this.style.display = 'flex';
        this.style.position = 'relative';
        this.style.whiteSpace = 'nowrap';
        this.style.justifyContent = FittedText.getJustify(align);
        this.fittedContent.setAttribute('style', FittedText.removeLineBreaks(`
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
                break;
            case 'max-width':
                this.style.maxWidth = `${this.maxWidth > 0 ? this.maxWidth + 'px' : 'unset'}`;
                this.setTransform();
                break;
            case 'align':
                this.style.justifyContent = FittedText.getJustify(newValue);
                this.fittedContent.style.textAlign = newValue;
                this.fittedContent.style.transformOrigin = `${newValue} center`;
                break;
            case 'use-inner-html':
                this.setText();
                this.setTransform();
                break;
        }
    }

    private setText() {
        if (this.useInnerHTML) {
            this.fittedContent.innerHTML = this.text;
        } else {
            this.fittedContent.innerText = this.text;
        }
    }

    private setTransform() {
        if (this.maxWidth <= 0) return;
        const width = this.getTextWidth();
        if (width > this.maxWidth) {
            this.fittedContent.style.transform = `scaleX(${this.maxWidth / width})`;
        } else {
            this.fittedContent.style.transform = 'scaleX(1)';
        }
    }

    private getTextWidth(): number {
        if (!this.fittedContent.parentNode) {
            return 0;
        }

        const scrollWidth = this.fittedContent.scrollWidth;

        // If fitted content has no width (for instance, when the element is not being displayed using display: none),
        // create an external element to calculate width
        if (scrollWidth < 1 && this.text !== '') {
            const measurer = this.fittedContent.cloneNode(true) as HTMLDivElement;
            const style = window.getComputedStyle(this.fittedContent);
            measurer.style.font = style.font;
            measurer.style.fontKerning = style.fontKerning;
            measurer.style.position = 'absolute';
            measurer.style.left = '-9999px';
            measurer.style.top = '-9999px';
            measurer.style.zIndex = '-9999';
            measurer.style.opacity = '0';
            if (this.useInnerHTML) {
                measurer.innerHTML = this.text;
            } else {
                measurer.innerText = this.text;
            }

            document.body.appendChild(measurer);
            const width = measurer.scrollWidth;
            document.body.removeChild(measurer);
            return width;
        } else {
            return scrollWidth;
        }
    }

    private static getJustify(align: string): string {
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

    private static removeLineBreaks(input: string): string {
        return input.replace(/\s+/g, ' ').trim();
    }
}

customElements.define('fitted-text', FittedText);
