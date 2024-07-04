import React, { useState } from 'react'

export default function SearchIntakes(props) {
    const dateList = props.entries.map(entry => ({ date: entry.entryDate, intake: entry.intake }));

    const [dates, setdates] = useState({ start: "", end: "" });
    const [comparisonResult, setComparisonResult] = useState(null);

    const convertTimestamp = (timestamp) => {
        let date = timestamp.toDate();
        let mm = date.getMonth() + 1;
        let dd = date.getDate();
        let yyyy = date.getFullYear();

        date = mm + '/' + dd + '/' + yyyy;
        return date;
    }
    function clearDates() {
        setdates({ start: "", end: "" });
        setComparisonResult(null);
    }

    const compareIntake = () => {
        const startIntake = dateList.find(data => convertTimestamp(data.date) === dates.start);
        const endIntake = dateList.find(data => convertTimestamp(data.date) === dates.end);

        if (startIntake && endIntake) {
            const difference = startIntake.intake - endIntake.intake;
            if (startIntake.intake > endIntake.intake) {
                
                setComparisonResult(
                    `You drank ${difference} more cups of water on ${convertTimestamp(startIntake.date)} than on ${convertTimestamp(endIntake.date)}.`
                );
            } else if(startIntake.intake == endIntake.intake){
                setComparisonResult(
                    `You drank the same cups of water on ${convertTimestamp(startIntake.date)} than on ${convertTimestamp(endIntake.date)}.`
                );
            }else if(startIntake.intake < endIntake.intake){
                setComparisonResult(
                    `You drank the ${Math.abs(difference)} less cups of water on ${convertTimestamp(startIntake.date)} than on ${convertTimestamp(endIntake.date)}.`
                );
            }
        } else {
            setComparisonResult("Selected dates not found in the list.");
        }
    };
    return (
        <div>
            <form id="compareForm" className="d-flex">
                <input list="startDates" className="form-control me-2" type="text" id="start_date"
                    name="start_date" required placeholder="Choose a date..." value={dates.start} onChange={(e) => setdates({ ...dates, start: e.target.value })} />
                <datalist id="startDates">
                    {
                        dateList.map(date => (<option value={convertTimestamp(date.date)} key={date.date}>{date.intake} cups of water</option>))
                    }
                </datalist>
                <input list="endDates" className="form-control me-2" type="text" id="end_date" name="end_date"
                    required placeholder="Choose another date..." value={dates.end} onChange={(e) => setdates({ ...dates, end: e.target.value })} />
                <datalist id="endDates">
                    {
                        dateList.map(date => (<option value={convertTimestamp(date.date)} key={date.date}>{date.intake} cups of water</option>))
                    }
                </datalist>
                <button className="btn btn-outline-success me-3" type="button"
                    onClick={compareIntake}>Compare</button>
                <button className="btn btn-outline-secondary" type="button"
                    onClick={clearDates}>Clear</button>
            </form>
            {comparisonResult ? (<div class="alert alert-info mt-2" role="alert">
                <strong>Comparison result!</strong> {comparisonResult}.
            </div>) : (" ")}
        </div>
    )
}
