import { lazy, Suspense, useEffect, useState } from "react";

const CalendarControl = lazy(() => import('./controls/Calendar'));

const LazyLoadSamplePage = () => {


    useEffect(() => {

    }, []);


    return (
        <>
            <Suspense fallback={<div className="w3-text-gray">Cargando calendario...</div>}>
                <CalendarControl />
            </Suspense>
        </>
    )
};

export default LazyLoadSamplePage;