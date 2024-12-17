import React, { useEffect, useState, useMemo } from 'react';
import Highcharts from 'highcharts/highmaps';
import HighchartsReact from 'highcharts-react-official';
import geoJsonRussia from './rus_simple_highcharts.geo.json';
import geoJsonWorld from './world_geo.json';

Highcharts.setOptions({
    credits: {
        enabled: false,
    },
});


const MapComponent = () => {
    const [yourDataArray, setYourDataArray] = useState([]);
    const [isWorldMap, setIsWorldMap] = useState(false);
    const [mapSize, setMapSize] = useState({ width: 1200, height: 800 }); // Размеры карты для отрисовки
    const [tempMapSize, setTempMapSize] = useState(mapSize); // Временные размеры карты для формы
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Поворот карты
    const rotateGeoJson = (geoJson, angle = -15) => {
        const radians = angle * (Math.PI / 180);
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);

        const rotatedGeoJson = JSON.parse(JSON.stringify(geoJson)); // Копируем объект
        rotatedGeoJson.features.forEach((feature) => {
            feature.geometry.coordinates.forEach((polygon) => {
                polygon.forEach((coords) => {
                    coords.forEach((point) => {
                        const x = point[0] * cos - point[1] * sin;
                        const y = point[0] * sin + point[1] * cos;
                        point[0] = x;
                        point[1] = y;
                    });
                });
            });
        });
        return rotatedGeoJson;
    };

    // Загружаем данные для карты
    const fetchData = async () => {
        const geoJson = isWorldMap ? geoJsonWorld : rotateGeoJson(geoJsonRussia);
        const response = await fetch('./data.json');
        const dataJson = await response.json();

        const dataMap = {};
        dataJson.data.forEach(region => {
            dataMap[region.code] = { color: region.color, coeff: region.coeff };
        });

        const dataArray = geoJson.features.map((feature) => {
            const regionCode = feature.properties['hc-key'];
            const dataEntry = dataMap[regionCode] || {};
            return {
                'hc-key': regionCode,
                value: dataEntry.coeff || 0,
                color: dataEntry.color || '#ccc'
            };
        });

        setYourDataArray(dataArray);
    };

    // Загружаем данные один раз при монтировании и при переключении между картами России и мира
    useEffect(() => {
        fetchData();
    }, [isWorldMap]);

    // Обработка изменений размеров в форме
    const handleTempSizeChange = (event) => {
        const { name, value } = event.target;
        setTempMapSize((prevSize) => ({
            ...prevSize,
            [name]: parseInt(value, 10),
        }));
    };

    // Обновляем размеры карты по нажатию "Применить"
    const handleSizeSubmit = (event) => {
        event.preventDefault();
        setMapSize(tempMapSize); // Устанавливаем новые размеры карты
        setIsModalOpen(false); // Закрываем модальное окно
    };

    // Генерируем опции для карты только при изменении размера или переключении карты
    const mapOptions = useMemo(() => {
        const geoJson = isWorldMap ? geoJsonWorld : rotateGeoJson(geoJsonRussia);
        return {
            chart: {
                map: geoJson,
                accessibility: {
                    enabled: false,
                },
                width: mapSize.width,
                height: mapSize.height,
            },
            title: {
                text: isWorldMap ? 'Карта Мира' : 'Карта Регионов России',
            },
            /*colorAxis: {
                min: 0,
                max: 2,
                stops: [
                    [0, '#FFCCCC'],
                    [0.5, '#FF6666'],
                    [1, '#FF0000'],
                ],
            },*/

            legend: {
                enabled: false,  // Отключает всю легенду
            },
            
            series: [{
                data: yourDataArray,
                mapData: geoJson,
                joinBy: 'hc-key',
                name: 'Коэффициент по регионам',
                color: '#FF6666',  // Задайте цвет для всех регионов
                states: {
                    hover: {
                        color: '#BADA55',
                    },
                },
                dataLabels: {
                    enabled: false,
                },
            }],
        };
    }, [mapSize, isWorldMap, yourDataArray]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', padding: '20px' }}>
            <div style={{ marginBottom: '20px' }}>
                <button onClick={() => setIsWorldMap(false)}>Карта России</button>
                <button onClick={() => setIsWorldMap(true)}>Карта Мира</button>
                <button onClick={() => setIsModalOpen(true)}>Изменить размер</button>
            </div>

            <div style={{ width: mapSize.width, height: mapSize.height }}>
                {yourDataArray.length > 0 && (
                    <HighchartsReact
                        highcharts={Highcharts}
                        constructorType={'mapChart'}
                        options={mapOptions}
                    />
                )}
            </div>

            {isModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <div style={{
                        background: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        width: '300px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    }}>
                        <h3>Выберите размеры карты</h3>
                        <form onSubmit={handleSizeSubmit}>
                            <label>
                                Ширина (px):
                                <input
                                    type="number"
                                    name="width"
                                    value={tempMapSize.width}
                                    onChange={handleTempSizeChange}
                                    style={{ marginBottom: '10px', width: '100%' }}
                                />
                            </label>
                            <label>
                                Высота (px):
                                <input
                                    type="number"
                                    name="height"
                                    value={tempMapSize.height}
                                    onChange={handleTempSizeChange}
                                    style={{ marginBottom: '10px', width: '100%' }}
                                />
                            </label>
                            <button type="submit" style={{ width: '100%' }}>Применить</button>
                        </form>
                        <button onClick={() => setIsModalOpen(false)} style={{ marginTop: '10px', width: '100%' }}>Отмена</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MapComponent;
