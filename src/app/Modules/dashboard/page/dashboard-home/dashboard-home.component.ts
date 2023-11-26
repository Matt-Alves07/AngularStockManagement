import { Subject, takeUntil } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ChartData, ChartOptions } from 'chart.js';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products/products.service';
import { GetAllProductsResponse } from 'src/app/Models/Interfaces/products/response/GetAllProductsResponse';
import { ProductsDataTransferService } from 'src/app/shared/services/products/products-data-transfer.service';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss']
})
export class DashboardHomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  public chartDatas!: ChartData;
  public chartOption!: ChartOptions;
  public productsList: Array<GetAllProductsResponse> = [];

  constructor(
    private productsService: ProductsService,
    private messageService: MessageService,
    private productsDtService: ProductsDataTransferService
  ) {}

  ngOnInit(): void {
    this.getProductsList();
  }

  getProductsList(): void {
    this.productsService
      .getAllProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.productsList = response;
            this.productsDtService.setProductsData(this.productsList);
            this.setProductsChartConfig();
          }
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Something went wrong trying to list products.',
            life: 10000,
          });
        }
      })
  }

  setProductsChartConfig(): void {
    if (this.productsList.length <= 0) {
      return;
    }

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const secondaryTextColor = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.chartDatas = {
      labels: this.productsList.map((element) => element?.name),
      datasets: [{
        label: 'Amount',
        backgroundColor: documentStyle.getPropertyValue('--indigo-400'),
        borderColor: documentStyle.getPropertyValue('--indigo-400'),
        hoverBackgroundColor: documentStyle.getPropertyValue('--indigo-500'),
        data: this.productsList.map((element) => element?.amount),
      }]
    };

    this.chartOption = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          }
        }
      },

      scales: {
        x: {
          ticks: {
            color: secondaryTextColor,
            font: {
              weight: '500',
            }
          },

          grid: {
            color: surfaceBorder,
          }
        },

        y: {
          ticks: {
            color: secondaryTextColor,
          },

          grid: {
            color: surfaceBorder,
          }
        }
      },
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
