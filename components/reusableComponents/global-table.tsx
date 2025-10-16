"use client"
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { GradientCardClass } from "@/helper/helper";
import { Fragment, useState } from "react";
import { Button } from "../ui/button";
import { SelectInput } from "./select-input";
import { Label } from "../ui/label";
import { Input } from "../ui/input";


interface heading {
    name: string,
    align: string
}

interface globalTableProps {
    heading: heading[],
    rowdata: Array<any>
    Component: React.ComponentType<{ row: any, indexNumber: number, specialEvent?: any }>;
    label: string,
    searching?: any
    clickEvent?: any
    specialEvent?: any
}




export default function GlobalTable({ heading, Component, label, rowdata, clickEvent, searching, specialEvent }: globalTableProps) {
    const [pg, setpg] = useState(0);
    const [rpg, setrpg] = useState(5);
    const pgOptions = [
        { label: "5", value: "5" }, { label: "15", value: "15" }, { label: "25", value: "25" }, { label: "35", value: "35" }
    ]
    function handleChangePage(event: any, newpage: any) {
        setpg(parseFloat(newpage));
    }

    function handleChangeRowsPerPage(event: any) {
        setrpg(parseInt(event));
        setpg(0);
    }


    const paginatedData = !!(rowdata?.length) ? rowdata?.slice(pg * rpg, pg * rpg + rpg) : [];

    return (

        <div className={GradientCardClass}>
            <Card className="@container/card overflow-hidden">
                <CardHeader style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                        <CardTitle>{label}</CardTitle>
                    </div>
                    <div style={{ width: "30%", display: "flex", justifyContent: "space-between" }}>
                        {!!(searching) && <Input placeholder="Filter emails..." className="max-w-sm" onChange={searching} />}
                        {!!(clickEvent) && <Button variant={"default"} onClick={clickEvent}>Add</Button>}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-hidden rounded-lg border">
                        <Table>
                            <TableHeader >
                                <TableRow>
                                    {heading.map((ele) => (
                                        <TableHead key={ele?.name} style={{ textAlign: ele.align as any }}>{ele.name}</TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody className="**:data-[slot=table-cell]:first:w-8">
                                {paginatedData.map((row, index) => (
                                    <Fragment key={index}>
                                        <Component indexNumber={index} row={row} specialEvent={specialEvent} />
                                    </Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    {(rowdata.length > 5) &&
                        <div
                            style={{
                                marginTop: "20px",
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <div
                                className="flex items-end gap-4"
                                style={{ width: "22%", alignItems: "center" }}
                            >
                                <Label htmlFor="row per page" style={{ width: "145px" }}>Row Per Page :</Label>
                                <SelectInput options={pgOptions} value={rpg.toString()} onChange={(key, value) => handleChangeRowsPerPage(value)} />
                            </div>
                            <div style={{ width: "11%", display: "flex", justifyContent: "space-between" }}>
                                <Button
                                    variant="outline"
                                    onClick={(e) => handleChangePage(e, pg - 1)}
                                    disabled={!pg}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={(e) => handleChangePage(e, pg + 1)}
                                    disabled={!!(rowdata?.length < pg * rpg + rpg)}
                                >
                                    Next
                                </Button>

                            </div>

                        </div>
                    }

                </CardContent>
            </Card>
        </div>
    );
}
