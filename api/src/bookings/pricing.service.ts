import { Injectable } from '@nestjs/common';
import { CarModel } from '@prisma/client';
import { DAY_MILLISECONDS } from './constants';

@Injectable()
export class PricingService {
  private readonly peakSeason = {
    startedDate: 1,
    startedMonth: 5,
    endedDate: 15,
    endedMonth: 8,
  };
  private readonly firstMidSeason = {
    startedDate: 16,
    startedMonth: 8,
    endedDate: 31,
    endedMonth: 9,
  };
  private readonly secondMidSeason = {
    startedDate: 1,
    startedMonth: 2,
    endedDate: 31,
    endedMonth: 4,
  };
  private readonly offSeason = {
    startedDate: 1,
    startedMonth: 10,
    endedDate: 1,
    endedMonth: 2,
  };

  calculateTotalPrice(carModel: CarModel, startedAt: Date, endedAt: Date) {
    let totalPrice = 0;

    let currentDay = startedAt;
    while (currentDay <= endedAt) {
      totalPrice += this.calculateSingleDayPrice(
        currentDay,
        carModel.peakSeasonPrice,
        carModel.midSeasonPrice,
        carModel.offSeasonPrice,
      );

      currentDay = new Date(currentDay.getTime() + DAY_MILLISECONDS);
    }

    return totalPrice;
  }

  private calculateSingleDayPrice(
    currentDay: Date,
    peakSeasonPrice: number,
    midSeasonPrice: number,
    offSeasonPrice: number,
  ) {
    const dates = this.getSeasonDates(currentDay.getFullYear());
    if (
      currentDay >= dates.peakSeason.startedAt &&
      currentDay <= dates.peakSeason.endedAt
    ) {
      return peakSeasonPrice;
    }
    if (
      (currentDay >= dates.firstMidSeason.startedAt &&
        currentDay <= dates.firstMidSeason.endedAt) ||
      (currentDay >= dates.secondMidSeason.startedAt &&
        currentDay <= dates.secondMidSeason.endedAt)
    ) {
      return midSeasonPrice;
    }
    if (
      currentDay >= dates.offSeason.startedAt &&
      currentDay <= dates.offSeason.endedAt
    ) {
      return offSeasonPrice;
    }

    return 0;
  }

  private getSeasonDates(year: number) {
    return {
      peakSeason: {
        startedAt: new Date(
          year,
          this.peakSeason.startedMonth,
          this.peakSeason.startedDate,
        ),
        endedAt: new Date(
          year,
          this.peakSeason.endedMonth,
          this.peakSeason.endedDate,
        ),
      },
      firstMidSeason: {
        startedAt: new Date(
          year,
          this.firstMidSeason.startedMonth,
          this.firstMidSeason.startedDate,
        ),
        endedAt: new Date(
          year,
          this.firstMidSeason.endedMonth,
          this.firstMidSeason.endedDate,
        ),
      },
      secondMidSeason: {
        startedAt: new Date(
          year,
          this.secondMidSeason.startedMonth,
          this.secondMidSeason.startedDate,
        ),
        endedAt: new Date(
          year,
          this.secondMidSeason.endedMonth,
          this.secondMidSeason.endedDate,
        ),
      },
      offSeason: {
        startedAt: new Date(
          year,
          this.offSeason.startedMonth,
          this.offSeason.startedDate,
        ),
        endedAt: new Date(
          year,
          this.offSeason.endedMonth,
          this.offSeason.endedDate,
        ),
      },
    };
  }
}
