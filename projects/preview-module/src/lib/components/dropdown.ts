import {
  Attribute,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  ViewChild,
  Optional,
  NgZone,
  Output,
  AfterViewInit,
} from '@angular/core'

import { ControlValueAccessor, NgControl } from '@angular/forms'

export interface DropdownOption {
  id: any
  name: string
  disabled?: boolean
  header?: boolean
  category?: string
  description?: string
}

export interface DropdownEvent {
  behavior: string
  args?: any[]
}

@Component({
  selector: 'dropdown',
  styles: [
    `
      .hide {
        display: none !important;
      }

      .desc {
        color: rgba(0, 0, 0, 0.6);
        font-size: 0.9em;
      }
    `,
  ],
  template: `
    <div
      class="ui dropdown"
      [ngClass]="classes"
      [class.multiple]="multiple"
      [class.search]="search"
      [class.loading]="loading"
      [class.disabled]="disabled"
      (keypress)="keyPressed()"
    >
      <input type="hidden" #dropdownValue />
      <div class="default text">{{ placeholder }}</div>
      <i class="dropdown icon"></i>
      <div class="menu">
        <ng-template ngFor let-option [ngForOf]="options">
          <div *ngIf="option.header" class="header clickable" (click)="toggleOpen(option.name)">
            {{ option.name }}
            <i [ngClass]="{ right: !isOpen(option), down: isOpen(option) }" class="angle icon"></i>
          </div>
          <div *ngIf="option.header" class="divider"></div>
          <div
            [ngClass]="{ hide: option.header || !isOpen(option) }"
            [attr.data-value]="option[idField]"
            [class.disabled]="option.disabled"
            class="item"
            style="padding-bottom:10px;"
          >
            <img class="ui image" *ngIf="option[imageField]" [src]="option[imageField]" />
            <span class="text" [innerHTML]="option[nameField]"></span>
            <span *ngIf="option['description']" class="desc">{{ option['description'] }}</span>
          </div>
        </ng-template>
      </div>
    </div>
  `,
})
export class Dropdown implements ControlValueAccessor, AfterViewInit {
  @Output() modelChange: EventEmitter<any> = new EventEmitter()
  @Input() options: DropdownOption[]
  @Input() valueType = 'object'
  @Input() search = true
  @Input() multiple: boolean
  @Input() placeholder: string
  @Input() loading: boolean
  @Input() allowAdditions: boolean
  @Input() classes: string
  @Input() idField = 'id'
  @Input() nameField = 'name'
  @Input() imageField = 'image'
  @Input() disabled: boolean
  @Input() useLabels = true
  @Input() actions: EventEmitter<DropdownEvent>
  @Input() direction = 'auto'

  value: any

  @ViewChild('dropdownValue', { static: true }) dropdownValue: ElementRef

  initialDropdownValue: string
  el: any

  openCategories = []
  searching = false

  onChange = _ => {}
  onTouched = () => {}

  constructor(
    @Attribute('class') classes,
    private ngZone: NgZone,
    private elementRef: ElementRef,
    @Optional() private ngControl: NgControl,
  ) {
    if (ngControl) {
      ngControl.valueAccessor = this
    }

    this.classes = classes || ''
    if (!this.classes.match(/selection|inline/)) {
      this.classes += ' selection'
    }
  }

  ngAfterViewInit() {
    if (this.actions) {
      this.actions.subscribe(event => this.el.dropdown(event.behavior, ...event.args))
    }
    this.ngZone.runOutsideAngular(() => {
      this.el = $(this.elementRef.nativeElement).find('.ui.dropdown')
      this.dropdownValue.nativeElement.value = this.initialDropdownValue
      this.el.dropdown({
        onChange: (dropdownValue, text, $selectedItem) => {
          this.searching = false
          // we only want to trigger this when an actual user interaction has occurred
          if (dropdownValue === this.value) {
            return
          }
          this.ngZone.run(() => {
            this.onDropdownChange(dropdownValue, text, $selectedItem)
          })
        },
        placeholder: this.placeholder,
        fullTextSearch: true,
        allowAdditions: this.allowAdditions,
        useLabels: this.useLabels,
        direction: this.direction,
      })
    })
  }

  onDropdownChange(dropdownValue: any, text: any, $selectedItem: any) {
    let modelValue: any

    if (this.multiple) {
      modelValue = dropdownValue.split(',')
      modelValue.remove('')
    } else {
      modelValue = dropdownValue
    }
    if (this.valueType === 'object') {
      if (this.multiple) {
        modelValue = modelValue.map((v: any) => {
          return this.parseOption(v)
        })
      } else {
        modelValue = this.parseOption(dropdownValue)
      }
    }
    if (modelValue) {
      this.value = modelValue
      this.onChange(this.value)
      this.modelChange.emit(this.value)
    }
  }

  parseOption(value: any) {
    let option = this.options.find(o => {
      return o[this.idField] === value
    })
    if (!option && this.allowAdditions) {
      const o = {}
      o[this.idField] = value
      o[this.nameField] = value
      option = <DropdownOption>o
    }
    return option
  }

  setDropdownValue(modelValue: any) {
    let dropdownValue: any

    dropdownValue = modelValue
    if (modelValue) {
      if (this.valueType === 'object' && typeof modelValue === 'object') {
        if (Array.isArray(modelValue)) {
          dropdownValue = modelValue.map(this.idField)
        } else {
          dropdownValue = modelValue[this.idField]
        }
      } else {
        dropdownValue = modelValue
      }
    }

    if (this.el && this.el.dropdown('get value') !== dropdownValue) {
      const isArray = Array.isArray(dropdownValue)
      if ((dropdownValue && !isArray) || (isArray && dropdownValue.length > 0)) {
        this.el.dropdown('set selected', dropdownValue)
      } else {
        this.el.dropdown('clear')
      }
    } else {
      this.initialDropdownValue = dropdownValue
    }
  }

  writeValue(modelValue: any) {
    this.value = modelValue
    this.setDropdownValue(modelValue)
  }

  registerOnChange(fn: (_: any) => void) {
    this.onChange = fn
  }
  registerOnTouched(fn: () => void) {
    this.onTouched = fn
  }

  isOpen(option: DropdownOption): boolean {
    const i = this.openCategories.findIndex((c: any) => c === option.category)
    if (i > -1 || !option.category || this.searching) {
      return true
    } else {
      return false
    }
  }

  toggleOpen(category: string) {
    const i = this.openCategories.findIndex((c: any) => c === category)
    if (i === -1) {
      this.openCategories.push(category)
    } else {
      this.openCategories.removeAt(i)
    }
  }

  keyPressed() {
    this.searching = true
  }
}
