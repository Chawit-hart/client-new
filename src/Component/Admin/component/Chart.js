import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const MyChart = ({ data, options, chartId }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // ทำลายกราฟเดิมหากมีอยู่
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    // สร้างกราฟใหม่
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data,
      options,
    });

    // Cleanup function เพื่อทำลายกราฟเมื่อ component unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, options]); // Rerun effect if data or options change

  return <canvas id={chartId} ref={chartRef}></canvas>;
};

export default MyChart;
