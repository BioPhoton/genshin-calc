import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlValueAccessor } from '@ngneat/reactive-forms';

type NumberInputMode = 'decimal' | 'percent';

function convertInput(value: number, mode: NumberInputMode) {
  switch (mode) {
    case 'decimal': {
      return value;
    }
    case 'percent': {
      return value * 100;
    }
  }
}

function convertOutput(value: number, mode: NumberInputMode) {
  switch (mode) {
    case 'decimal': {
      return value;
    }
    case 'percent': {
      return value / 100;
    }
  }
}

@Component({
  selector: 'ui-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: { '(blur)': 'onTouched()' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: NumberInputComponent,
      multi: true,
    },
  ],
})
export class NumberInputComponent extends ControlValueAccessor<number> {
  @Input() label = '';

  @Input() min = 0;
  @Input() max?: number;

  @Input() mode: NumberInputMode = 'decimal';

  value: number | null = null;

  writeValue(value: number): void {
    this.value = convertInput(value, this.mode);
  }

  onInputChange(value: string) {
    this.onChange && this.onChange(convertOutput(parseFloat(value), this.mode));
  }
}
