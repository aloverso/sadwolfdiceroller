import React, { ReactElement, useEffect, useState } from "react";
import dayjs from "dayjs";
import { Die } from "./domain/Die";
import { Roll } from "./domain/Roll";
import * as client from "./SadWolfClient";

export const History = (): ReactElement => {
  const [groupedHistory, setGroupedHistory] = useState<Record<string, Roll[]>>({});

  useEffect(() => {
    const groupByDate = (rolls: Roll[]): Record<string, Roll[]> => {
      return rolls.reduce<Record<string, Roll[]>>((acc: Record<string, Roll[]>, roll: Roll): Record<
        string,
        Roll[]
      > => {
        if (acc[yearMonthDayFormat(roll.timestamp)]) {
          acc[yearMonthDayFormat(roll.timestamp)].push(roll);
        } else {
          acc[yearMonthDayFormat(roll.timestamp)] = [roll];
        }
        return acc;
      }, {});
    };

    client.getHistory({
      onSuccess: (history) => setGroupedHistory(groupByDate(history)),
      onError: () => {},
    });
  }, []);

  const dayOfWeekFormat = (timestamp: string): string => {
    return dayjs(timestamp).format("ddd, MMM D YYYY");
  };

  const yearMonthDayFormat = (timestamp: string): string => {
    return dayjs(timestamp).format("YYYY-MM-DD");
  };

  const diceCountFormat = (die: Die, count: number): ReactElement => {
    return (
      <>
        <span className="text-tomato">{count}</span>
        <span className="text-green">{die}</span>
      </>
    );
  };

  return (
    <div className="container">
      <div className="row mts">
        <a className="pull-right phs" href="/">
          home
        </a>
        <a className="pull-right phs" href="/about">
          about
        </a>
      </div>
      <div className="row">
        {Object.keys(groupedHistory)
          .sort()
          .reverse()
          .map((date) => (
            <div className="col-sm-8 col-sm-offset-2 mbxl" key={date} data-testid="day">
              <h3 className="text-l">{dayOfWeekFormat(date)}</h3>
              <hr />
              <table>
                <tbody>
                  {groupedHistory[date]
                    .sort((a, b) => {
                      if (a.timestamp < b.timestamp) {
                        return 1;
                      }
                      if (a.timestamp > b.timestamp) {
                        return -1;
                      }
                      return 0;
                    })
                    .map((roll, i) => (
                      <tr key={i} data-testid="roll">
                        <td className="text-m prl">{dayjs(roll.timestamp).format("H:mm")}</td>
                        <td className="text-m">{diceCountFormat(roll.die, roll.count)}</td>
                        <td className="text-m">&rarr;</td>
                        <td className="text-m prd bold align-right">{roll.total}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ))}
      </div>
    </div>
  );
};
