import { Component, OnInit } from '@angular/core';
import { AdministratorService } from '../administrator.service';
import { Chart, ArcElement, Tooltip, Legend, PolarAreaController, RadialLinearScale } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend, PolarAreaController, RadialLinearScale);

@Component({
  selector: 'app-app-analytics',
  templateUrl: './app-analytics.component.html',
  styleUrls: ['./app-analytics.component.css']
})
export class AppAnalyticsComponent implements OnInit {
  intervalOptions = ['weekly', 'monthly', 'yearly'];
  selectedInterval = 'monthly';
  startDate: string | null = null;
  endDate: string | null = null;

  analyticsData: any = null;
  errorMessage: string | null = null;

  userActivityData: any;
  userActivityChart: any;

  constructor(private service: AdministratorService) {}

  ngOnInit(): void {
    this.fetchUserActivityData();
  }

  fetchUserActivityData(): void {
    this.service.getUserActivityStatistics().subscribe((data: any) => {
      this.userActivityData = data;
      this.renderUserActivityChart();
    });
  }
  renderUserActivityChart(): void {
    const ctx = document.getElementById('userActivityChart') as HTMLCanvasElement;

    this.userActivityChart = new Chart(ctx, {
      type: 'polarArea',
      data: {
        labels: Object.keys(this.userActivityData),
        datasets: [
          {
            label: 'User Activity',
            data: Object.values(this.userActivityData),
            backgroundColor: ['#CC8EBF', '#FF7A33', '#3B163B'],
          }
        ]
      },
      options: {
        responsive: true,
        aspectRatio: 1, 
        plugins: {
          legend: {
            position: 'right',
          }
        },
      }
    });
  }

  fetchAnalytics() {
    this.service.getAnalytics(this.selectedInterval, this.startDate, this.endDate)
      .subscribe({
        next: (data) => {
          this.analyticsData = data;
          this.errorMessage = null;
        },
        error: (err) => {
          this.analyticsData = null;
          this.errorMessage = 'Failed to fetch analytics data.';
          console.error(err);
        }
      });
  }

  getKeys(obj: any): string[] {
    return Object.keys(obj || {});
  }
}
