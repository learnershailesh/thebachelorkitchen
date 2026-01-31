import { useState } from 'react';
import { format, addMonths, subMonths, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isAfter, setHours, setMinutes, isBefore } from 'date-fns';
import { UtensilsCrossed, AlertCircle, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const SmartCalendar = ({ userPlan, onDateClick }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const today = new Date();

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => {
        // Prevent going back past the current month (optional, but good UX)
        if (isSameMonth(currentDate, new Date())) return;
        setCurrentDate(subMonths(currentDate, 1));
    };

    // Parse skipped meals from userPlan
    // userPlan might be null initially
    const skippedMeals = userPlan?.skippedMeals || [];

    const getDayStatus = (day) => {
        const skips = skippedMeals.filter(s => isSameDay(new Date(s.date), day));
        const hasLunch = skips.some(s => s.meal === 'lunch');
        const hasDinner = skips.some(s => s.meal === 'dinner');
        const hasBoth = skips.some(s => s.meal === 'both'); // or separate records if logic changes

        // Logic check: if 'both' is a single record or if L and D are both present
        if (hasBoth || (hasLunch && hasDinner)) return 'skipped_all';
        if (hasLunch) return 'skipped_lunch';
        if (hasDinner) return 'skipped_dinner';
        return 'active';
    };

    // Generate days for the grid
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

    return (
        <div className="card w-full">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={prevMonth}
                        disabled={isSameMonth(currentDate, new Date())}
                        className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <h3 className="font-bold text-xl mb-0">{format(currentDate, 'MMMM yyyy')}</h3>
                    <button
                        onClick={nextMonth}
                        disabled={userPlan?.endDate && isSameMonth(currentDate, new Date(userPlan.endDate))}
                        className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
                <div className="flex gap-3 text-xs">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Active</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400"></span> Partial</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400"></span> Skipped</span>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center mb-2 font-medium text-gray-400 text-sm">
                <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
            </div>

            <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day) => {
                    const status = getDayStatus(day);
                    const isPast = isBefore(day, today) && !isSameDay(day, today);

                    // Simple styling logic
                    let bgClass = "bg-gray-50 hover:bg-gray-100";
                    let textClass = "text-gray-700";
                    let label = "Active";

                    if (status === 'skipped_all') {
                        bgClass = "bg-red-50 border border-red-200";
                        textClass = "text-red-600";
                        label = "Skipped";
                    } else if (status === 'skipped_lunch') {
                        bgClass = "bg-yellow-50 border border-yellow-200";
                        textClass = "text-yellow-700";
                        label = "No Lunch";
                    } else if (status === 'skipped_dinner') {
                        bgClass = "bg-yellow-50 border border-yellow-200";
                        textClass = "text-yellow-700";
                        label = "No Dinner";
                    } else if (!isPast) {
                        bgClass = "bg-green-50 border border-green-200";
                        textClass = "text-green-700";
                    }

                    return (
                        <button
                            key={day.toISOString()}
                            onClick={() => onDateClick(day)}
                            className={`p-2 rounded-xl flex flex-col items-center justify-center min-h-[70px] transition relative overflow-hidden ${bgClass} ${isPast ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}`}
                            disabled={isPast}
                        >
                            <span className={`text-lg font-bold ${textClass}`}>{format(day, 'd')}</span>
                            {!isPast && (
                                <span className={`text-[10px] uppercase font-bold mt-1 ${textClass}`}>
                                    {label}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default SmartCalendar;
