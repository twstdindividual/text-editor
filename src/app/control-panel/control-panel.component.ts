import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TextService } from '../text-service/text.service';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ControlPanelComponent {
  constructor(public textService: TextService) {}
}
