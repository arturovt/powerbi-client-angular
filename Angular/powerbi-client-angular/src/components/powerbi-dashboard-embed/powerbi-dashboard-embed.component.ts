// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Dashboard, Embed, IDashboardEmbedConfiguration } from 'powerbi-client';
import {
  EventHandler,
  PowerBIEmbedComponent,
} from '../powerbi-embed/powerbi-embed.component';
import { isEmbedSetupValid } from '../../utils/utils';

/**
 * Dashboard component to embed the dashboard, extends the Base component
 */
@Component({
  selector: 'powerbi-dashboard[embedConfig]',
  template: '<div class={{cssClassName}} #dashboardContainer></div>',
  standalone: true,
})
export class PowerBIDashboardEmbedComponent
  extends PowerBIEmbedComponent
  implements OnInit, OnChanges, AfterViewInit
{
  // Input() specify properties that will be passed from parent
  // Configuration for embedding the PowerBI Dashboard (Required)
  @Input() embedConfig!: IDashboardEmbedConfiguration;

  // Map of event name and handler methods pairs to be triggered on the event (Optional)
  @Input() eventHandlers?: Map<string, EventHandler | null>;

  // Ref to the HTML div container element
  @ViewChild('dashboardContainer')
  private containerRef!: ElementRef<HTMLDivElement>;

  // Embedded entity
  // Note: Do not read or assign to this member variable directly, instead use the getter and setter
  private _embed?: Embed;

  // Getter for this._embed
  private get embed(): Embed | undefined {
    return this._embed;
  }

  // Setter for this._embed
  private set embed(newEmbedInstance: Embed | undefined) {
    this._embed = newEmbedInstance;
  }

  constructor() {
    super();
  }

  // Returns embed object to calling function
  getDashboard(): Dashboard {
    return this.embed as Dashboard;
  }

  ngOnInit(): void {
    // Initialize PowerBI service instance variable from parent
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.embedConfig) {
      // Check if the function is being called for the first time
      if (changes.embedConfig.isFirstChange()) {
        return;
      }

      const prevEmbedConfig: IDashboardEmbedConfiguration =
        changes.embedConfig.previousValue;
      const currentEmbedConfig: IDashboardEmbedConfiguration =
        changes.embedConfig.currentValue;
      if (
        JSON.stringify(prevEmbedConfig) !== JSON.stringify(currentEmbedConfig)
      ) {
        // Input from parent get updated, thus call embedDashboard function
        this.embedDashboard();
      }
    }

    // Set event handlers if available
    if (this.eventHandlers && this.embed) {
      super.setEventHandlers(this.embed, this.eventHandlers);
    }
  }

  ngAfterViewInit(): void {
    // Check if container exists on the UI
    if (this.containerRef.nativeElement) {
      // Decide to embed or bootstrap
      if (this.embedConfig.accessToken && this.embedConfig.embedUrl) {
        this.embedDashboard();
      } else {
        this.embed = this.powerbi.bootstrap(
          this.containerRef.nativeElement,
          this.embedConfig
        );
      }
    }

    // Set event handlers if available
    if (this.eventHandlers && this.embed) {
      super.setEventHandlers(this.embed, this.eventHandlers);
    }
  }

  /**
   * Embed the PowerBI Dashboard
   *
   * @returns void
   */
  private embedDashboard(): void {
    if (!isEmbedSetupValid(this.containerRef, this.embedConfig)) {
      return;
    }

    this.embed = this.powerbi.embed(
      this.containerRef.nativeElement,
      this.embedConfig
    );
  }
}
