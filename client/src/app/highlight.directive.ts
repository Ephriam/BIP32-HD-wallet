import { Directive, ElementRef, Input, HostListener } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})

export class HighlightDirective {

constructor(private el: ElementRef) { }

  @Input('appHighlight') highlightColor: string;
  @Input() defaultColor: string;

  @HostListener('mouseenter') mouseEnter() {
    this.highlight(this.highlightColor || 'red');
  }

  @HostListener('mouseleave') onmouseleave(){
    this.highlight(this.highlightColor)
  }
  
  @HostListener('mousedown') onmousedown() {
    this.highlight(this.defaultColor)
  }

  highlight(color: string){
    this.el.nativeElement.style.backgroundColor = color;
  }

}
