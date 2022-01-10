import { LitElement, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { Variable, LevelVariable, EVariableType, ListVariable, TextVariable } from '../types';

import './variable-slider';
import './button-group';
import { fireEvent } from 'custom-card-helpers';

@customElement('scheduler-variable-picker')
export class SchedulerVariablePicker extends LitElement {
  @property() variable?: Variable | null;
  @property() value?: string | number | null;

  render() {
    if (!this.variable) return html``;
    else if (this.variable.type == EVariableType.Level) return this.renderLevelVariable();
    else if (this.variable.type == EVariableType.List) return this.renderListVariable();
    else if (this.variable.type == EVariableType.Text) return this.renderTextVariable();
    else return html``;
  }

  private levelVariableUpdated(ev: CustomEvent) {
    this.value = ev.detail.value;
    fireEvent(this, 'value-changed', { value: ev.detail.value });
  }

  renderLevelVariable() {
    const variable = this.variable as LevelVariable;
    const value = Number(this.value);

    return html`
      <variable-slider
        min=${variable.min}
        max=${variable.max}
        step=${variable.step}
        scaleFactor=${variable.scale_factor}
        value=${value}
        .unit=${variable.unit}
        ?optional=${variable.optional}
        ?disabled=${isNaN(value)}
        @value-changed=${this.levelVariableUpdated}
      >
      </variable-slider>
    `;
  }

  private listVariableUpdated(ev: Event | string) {
    const value = typeof ev == 'string' ? ev : String((ev.target as HTMLInputElement).value);
    this.value = value;
    fireEvent(this, 'value-changed', { value: value });
  }

  renderListVariable() {
    const variable = this.variable as ListVariable;
    const options = variable.options;
    const value = String(this.value) || null;
    if (options.length == 1 && value != options[0].value) this.listVariableUpdated(options[0].value);

    return html`
      <button-group .items=${options} value=${value} @change=${this.listVariableUpdated}> </button-group>
    `;
  }

  renderTextVariable() {
    const variable = this.variable as TextVariable;
    const value = this.value;

    return html`
      <paper-input
        no-label-float
        .value=${value || ''}
        @value-changed=${this.listVariableUpdated}
        .label=${variable.name}
      >
      </paper-input>
    `;
  }
}
