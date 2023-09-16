import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import {
  Form,
  Button,
  Container,
  Card,
  Row,
  Col,
  Table,
} from "react-bootstrap";
import Error from "../../component/features/Error";
import Loader from "../../component/features/Loader";
import { Typography } from "@mui/material";

import { listIncRate } from "../../redux/actions/info/infoAction";
const Child = () => {
  const listIncRateReducer = useSelector((state) => state.listIncRateReducer);
  const { data, error, loading } = listIncRateReducer;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(listIncRate());
  }, []);

  const data1 = data
    ?.sort((a, b) => a._id.السنة - b._id.السنة)
    .sort((a, b) => a._id.المحافظة?.localeCompare(b._id.المحافظة));

  const columnsDefs = [
    {
      headerName: "المحافظة",
      field: "_id.المحافظة",
    },
    {
      headerName: "السنة",
      field: "_id.السنة",
      width: 500,
    },

    {
      headerName: "معدل التزاحم",
      field: "_id.معدل التزاحم",
      width: 500,
    },
  ];

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
    }),
    []
  );

  const userLoginReducer = useSelector((state) => state.userLoginReducer);

  return (
    <Container style={{ marginTop: "20px" }}>
      {loading ? (
        <Loader />
      ) : error ? (
        <Error error={error} />
      ) : data ? (
        <>
          <Typography
            variant="h6"
            style={{ marginBottom: "10px", textAlign: "right" }}
          >
            متوسط حجم الاسر في المحافظات
          </Typography>

          <div
            className="ag-theme-alpine"
            style={{ height: 500, textAlign: "right", width: "100%" }}
          >
            <AgGridReact
              rowData={data1}
              columnDefs={columnsDefs}
              defaultColDef={defaultColDef}
              rowSelection="multiple"
              animateRows={true}
            />
          </div>
        </>
      ) : null}
    </Container>
  );
};

export default Child;
