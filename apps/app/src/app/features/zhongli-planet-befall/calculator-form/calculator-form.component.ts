import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { TalentLevel } from '@genshin-calc/core';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CalculatorParams } from '../types';

@Component({
  selector: 'app-zhongli-planet-befall-calculator-form',
  templateUrl: './calculator-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalculatorFormComponent implements OnInit, OnDestroy {
  @Input()
  set value(value: CalculatorParams) {
    this.setFormValue(value);
  }

  @Output()
  valueChange = new EventEmitter<CalculatorParams>();

  readonly form = new FormGroup({
    skillDamage: new FormGroup({
      talentLevel: new FormControl<TalentLevel>(),
      atk: new FormControl<number>(),
      hp: new FormControl<number>(),
    }),
    damageBonus: new FormGroup({
      elementalDamageBonus: new FormControl<number>(),
      burstDamageBonus: new FormControl<number>(),
      enableGeoResonance: new FormControl<boolean>(),
    }),
    damageReduction: new FormGroup({
      characterLevel: new FormControl<number>(),
      enemyLevel: new FormControl<number>(),
      baseResistance: new FormControl<number>(),
    }),
    critical: new FormGroup({
      criticalRate: new FormControl<number>(),
      criticalDamage: new FormControl<number>(),
    }),
  });

  private readonly onDestroy$ = new Subject();

  ngOnInit() {
    this.form.value$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(({ skillDamage, damageBonus, damageReduction, critical }) => {
        this.valueChange.emit({
          talentLevel: skillDamage.talentLevel,
          character: {
            level: damageReduction.characterLevel,
            stats: {
              atk: skillDamage.atk,
              hp: skillDamage.hp,
              criticalRate: critical.criticalRate,
              criticalDamage: critical.criticalDamage,
            },
            bonus: {
              elementalDamageBonus: damageBonus.elementalDamageBonus,
              enableGeoResonanceBonus: damageBonus.enableGeoResonance,
              attackTypeDamageBonus: damageBonus.burstDamageBonus,
            },
          },
          enemy: {
            level: damageReduction.enemyLevel,
            resistance: {
              baseResistance: damageReduction.baseResistance,
              resistanceBonus: 0,
            },
          },
        });
      });
  }

  ngOnDestroy() {
    this.onDestroy$.next();
  }

  setFormValue({ character, enemy, talentLevel }: CalculatorParams) {
    this.form.setValue(
      {
        skillDamage: {
          talentLevel,
          hp: character.stats.hp,
          atk: character.stats.atk,
        },
        damageBonus: {
          burstDamageBonus: character.bonus.attackTypeDamageBonus,
          elementalDamageBonus: character.bonus.elementalDamageBonus,
          enableGeoResonance: character.bonus.enableGeoResonanceBonus,
        },
        damageReduction: {
          characterLevel: character.level,
          enemyLevel: enemy.level,
          baseResistance: enemy.resistance.baseResistance,
        },
        critical: {
          criticalRate: character.stats.criticalRate,
          criticalDamage: character.stats.criticalDamage,
        },
      },
      { emitEvent: false },
    );
  }
}
