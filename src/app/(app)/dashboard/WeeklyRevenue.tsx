import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const weeklyRevenue = [1200, 2450, 1850, 2100, 1820, 1650, 2120];
const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const maxValue = Math.max(...weeklyRevenue);
const yTicks = [3500, 2500, 2000, 1500, 1000, 500, 0];
const plotHeight = 320;

const WeeklyRevenue = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>WEEKLY REVENUE</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="rounded-xl p-2 sm:p-3">
                    <div className="grid grid-cols-[54px_1fr] gap-3 sm:grid-cols-[70px_1fr] sm:gap-4">
                        <div className="relative h-64 sm:h-72 lg:h-80">
                            <div className="flex h-full flex-col justify-between pr-1 text-right text-xs text-black/55 sm:text-[18px]">
                                {yTicks.map((tick) => (
                                    <span key={tick}>{tick === 0 ? "0" : `$${tick}`}</span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="relative h-64 sm:h-72 lg:h-80">
                                <div className="pointer-events-none absolute inset-0">
                                    {yTicks.map((tick, index) => {
                                        const top = (index / (yTicks.length - 1)) * 100;
                                        return (
                                            <span
                                                key={tick}
                                                className="absolute left-0 right-0 border-t border-dashed border-black/10"
                                                style={{ top: `${top}%` }}
                                            />
                                        );
                                    })}

                                    {Array.from({ length: weekdays.length + 1 }).map((_, index) => {
                                        const left = (index / weekdays.length) * 100;
                                        return (
                                            <span
                                                key={`v-${index}`}
                                                className="absolute bottom-0 top-0 border-l border-dashed border-black/10"
                                                style={{ left: `${left}%` }}
                                            />
                                        );
                                    })}
                                </div>

                                <div className="absolute inset-x-2 bottom-0 top-0 sm:inset-x-5">
                                    {weeklyRevenue.map((value, index) => {
                                        const barHeight = Math.max((value / maxValue) * plotHeight, 18);
                                        const left = (index + 0.5) * (100 / weekdays.length);

                                        return (
                                            <div
                                                key={weekdays[index]}
                                                className="absolute bottom-0 flex -translate-x-1/2 items-end justify-center"
                                                style={{ left: `${left}%`, height: `${barHeight}px`, width: "12%" }}
                                            >
                                                <div className="h-full w-full max-w-14 rounded-[999px] bg-linear-to-b from-[#D94906] to-[#F4E8D8]" />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="mt-3 grid grid-cols-7 px-2 text-center text-sm text-black/55 sm:mt-4 sm:px-5 sm:text-[18px]">
                                {weekdays.map((day) => (
                                    <span key={day}>{day}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default WeeklyRevenue;
