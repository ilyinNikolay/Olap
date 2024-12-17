import React from 'react';

const MapSizeModal = ({ tempMapSize, onChange, onSubmit, onClose }) => (
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
            <form onSubmit={onSubmit}>
                <label>
                    Ширина (px):
                    <input
                        type="number"
                        name="width"
                        value={tempMapSize.width}
                        onChange={onChange}
                        style={{ marginBottom: '10px', width: '100%' }}
                    />
                </label>
                <label>
                    Высота (px):
                    <input
                        type="number"
                        name="height"
                        value={tempMapSize.height}
                        onChange={onChange}
                        style={{ marginBottom: '10px', width: '100%' }}
                    />
                </label>
                <button type="submit" style={{ width: '100%' }}>Применить</button>
            </form>
            <button onClick={onClose} style={{ marginTop: '10px', width: '100%' }}>Отмена</button>
        </div>
    </div>
);

export default MapSizeModal;
