import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CalculatedDamage } from '@genshin-calc/core';

@Component({
  selector: 'ui-calculation-results',
  templateUrl: './calculation-results.component.html',
  styleUrls: ['./calculation-results.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalculationResultsComponent {
  @Input()
  calculatedDamage!: CalculatedDamage;

  @Input() element?: 'geo' | 'cryo';

  get textColor() {
    switch (this.element) {
      case 'geo': {
        return 'text-yellow-500';
      }
      case 'cryo': {
        return 'text-blue-300';
      }
      default: {
        return '';
      }
    }
  }
}
