import MaterialTable from "material-table";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { locale } from "@utils/locale.js";
import Admin from "@components/layouts/Admin.js";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import { DateRangePicker } from "react-date-range";
import { id } from "date-fns/locale";

export default function ReportPage() {
  const router = useRouter();

  const [reportState, setReportState] = useState([]);
  const [loading, setloading] = useState(false);
  const [isExport, setisExport] = useState(false);
  const [ranges, setranges] = useState([]);
  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  const [columns, setColumns] = useState([
    { title: "PEMESANAN", field: "orders.no_transaction", editable: "never" },
    { title: "CUSTOMER", field: "orders.users.email", editable: "never" },
    { title: "JUMLAH", field: "orders.order_items.length" },
    {
      title: "TANGGAL UDPATE",
      field: "updated_at",
      type: "date",
      dateSetting: {
        format: "dd/MM/yyyy",
      },
      editable: "never",
    },
    {
      title: "TANGGAL LAPORAN",
      field: "date_report",
      type: "date",
      dateSetting: {
        format: "dd/MM/yyyy",
      },
      editable: "never",
    },
  ]);

  useEffect(() => {
    getReport();
  }, [selectionRange]);

  useEffect(() => {
    if (window.localStorage.getItem("@previlage") === "kasir") {
      router.replace("/admin/kasir");
    } else {
      getReport();
    }
  }, []);

  const unAutorize = () => {
    router.replace("/login");
  };

  // get Report
  const getReport = () => {
    console.info("REQQQ");
    setloading(true);
    fetch("/api/v1/report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + window.localStorage.getItem("token"),
      },
      body: JSON.stringify({
        start_date: selectionRange?.startDate,
        end_date: selectionRange?.endDate,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status == 200) {
          const data = res.data;
          setReportState(data);
          setloading(false);
          if (data?.length == 0 ) {
            toast.dismiss();
            toast.warn("Laporan masih kosong");
          }
        } else if (res.status == 401) {
          setloading(false);
          unAutorize();
        } else {
          toast.error("Terjadi kesalahan data laporan");
          setloading(false);
        }
      })
      .catch((e) => {
        setloading(false);
        toast.error("Internal Server Error");
        console.info(e);
      });
  };

  const handleClose = () => {
    setisExport(false);
  };

  const handleSelect = (ranges) => {
    setSelectionRange({
      startDate: ranges.selection?.startDate,
      endDate: ranges.selection?.endDate,
      key: "selection",
    });
    console.info(selectionRange);
  };

  return (
    <>
      <div className="flex flex-wrap mt-12">
        <div className="w-full mb-12 px-4">
          <MaterialTable
            title="Report"
            //   components={{
            //     Toolbar: (props) => (
            //       <Button onClick={() => setisExport(true)} variant="contained">
            //         Filter
            //       </Button>
            //     ),
            //   }}
            isLoading={loading}
            columns={columns}
            data={reportState}
            localization={locale}
            actions={[
              {
                icon: "filter_list",
                tooltip: "Filter",
                position: "toolbar",
                onClick: () => {
                  setisExport(true);
                },
              },
            ]}
            options={{
              // ..other options
              emptyRowsWhenPaging: false,
              exportAllData: false,
              exportButton: {
                csv: false,
                pdf: true,
              },
            }}
          />
        </div>
      </div>
      <Dialog
        open={isExport}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Filter Tanggal</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description"></DialogContentText>
          {/* content */}
          <DateRangePicker
            locale={id}
            ranges={[selectionRange]}
            onChange={handleSelect}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

ReportPage.layout = Admin;
