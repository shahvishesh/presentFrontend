import { useEffect, useMemo, useState } from "react";
import { getEmployeeById, type EmployeeResponse } from "../../api/employee.api";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Box, Divider, Paper, Stack, Typography } from "@mui/material";
import ManagerTravelPlanTabs from "./ManagerTravelPlanTabs";
import {
    pageDividerSx,
    pageHeaderPaperSx,
    pageHeaderStackSx,
    pageHeaderTitleSx,
    pageRootSx,
} from "../../components/page/pageStyles";

export default function ManagerEmployeeDetail(){
    const[employee, setEmployee] = useState<EmployeeResponse>();
    const { employeeId } = useParams();

    const employeeIdNum = useMemo(() => Number(employeeId), [employeeId]);


    useEffect(() => {
            if (!Number.isFinite(employeeIdNum)) return;

            getEmployeeById(employeeIdNum)
              .then((data) => setEmployee(data))
              .catch(() => toast.error("Failed to load employee detail"));
        }, [employeeIdNum]);
        
    return(
        <Box sx={pageRootSx}>
            <Paper variant="outlined" sx={pageHeaderPaperSx}>
                <Stack spacing={1} alignItems="flex-start" sx={pageHeaderStackSx}>
                    <Stack spacing={0.25}>
                        <Typography variant="h6" sx={pageHeaderTitleSx}>
                            Employee
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            View employee details and travel plans.
                        </Typography>
                    </Stack>
                </Stack>
            </Paper>

            {employee && (
                <Paper
                    variant="outlined"
                    sx={{
                        p: { xs: 2, sm: 2.5 },
                        overflow: "hidden",
                        borderTop: 0,
                        borderRadius: 0,
                        mb: 2,
                    }}
                >
                    <Typography variant="h5">
                        {employee.firstName} {employee.lastName}
                    </Typography>
                    <Divider sx={pageDividerSx} />

                    <Stack spacing={0.5}>
                        <Typography variant="body1">Designation: {employee.designation}</Typography>
                        <Typography variant="body1">Department: {employee.department}</Typography>
                    </Stack>
                </Paper>
            )}

            {Number.isFinite(employeeIdNum) && (
                <ManagerTravelPlanTabs employeeId={employeeIdNum} />
            )}
        </Box>
    );
}