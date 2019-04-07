import { Component, OnInit } from '@angular/core';
import { VendorEventService } from './Services/vendor-event.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import {
  ChangeDetectionStrategy} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  isSameDay,
  isSameMonth} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarView
} from 'angular-calendar';
import { PromotionService } from '../vendor-promotions/Services/promotion.service';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'app-vendor-calendar',
  templateUrl: './vendor-calendar.component.html',
  styleUrls: ['./vendor-calendar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VendorCalendarComponent implements OnInit {

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  actions: CalendarEventAction[] = [];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [];

  activeDayIsOpen = true;

  constructor(
    private route: ActivatedRoute,
    private vendorEventsService: VendorEventService,
    private promotionService: PromotionService) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const vendorId = +params.get('vendorId');
      this.vendorEventsService.getVendorEvents(vendorId).subscribe(vendorEvents => {
        vendorEvents.forEach(vendorEvent => {
          const title = 'Providing a ' + vendorEvent.serviceType + ' service of '
            + vendorEvent.serviceName + ' for an event at ' + vendorEvent.eventTime;

          this.events = [
            ...this.events,
            {
              start: startOfDay(new Date(vendorEvent.eventDate)),
              end: endOfDay(new Date(vendorEvent.eventDate)),
              title: title,
              color: colors.yellow,
              actions: this.actions,
              resizable: {
                beforeStart: false,
                afterEnd: false
              },
              draggable: false
           }
          ];

        });
        this.refresh.next();
      }, error => {
        console.log(error);
      });

        this.promotionService.getAllPromotions(vendorId).subscribe(promotions => {
          promotions.forEach(promotion => {

            let title: any;
            if (promotion.promotionType === 'percent') {
              title = promotion.discount + '% Off! ' + promotion.description;
            } else {
              title = '$' + promotion.discount + ' Off! ' + promotion.description;
            }

            this.events = [
              ...this.events,
              {
                start: new Date(promotion.startDate),
                end: new Date(promotion.endDate),
                title: title,
                color: colors.blue,
                allDay: true,
             }
            ];

          });
          this.refresh.next();
        }, error => {
          console.log(error);
        });
    });
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
  }

  handleEvent(event: CalendarEvent): void {
    console.log(event.title);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
}
