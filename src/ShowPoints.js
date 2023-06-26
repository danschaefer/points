// ShowPoints.js

import './App.css';
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';


export default function ShowPoints({tally}) {
    const columns = [
        { field: 'id', headerName: tally.headers[0], width: 120 },
        { field: 'name', headerName: tally.headers[1], width: 130 },
        { field: 'month1', headerName: tally.headers[2], type: 'number',width:100},
        { field: 'month2', headerName: tally.headers[3], type: 'number',width:100},
        { field: 'month3', headerName: tally.headers[4], type: 'number',width:100},
        { field: 'total', headerName: tally.headers[5], type: 'number',width:100},
    ];
    return (
        <div style={{ minHeight: 400, width: '80%' }}>
            <h3>{tally.title}</h3>
            <DataGrid
                rows={tally.data}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
                pageSizeOptions={[5, 10, 25, 50, 100]}
            />
        </div>
    );
}
