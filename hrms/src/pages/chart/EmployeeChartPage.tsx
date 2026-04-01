import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import {
  getManagerialChain,
  getEmployeesByManagerId,
} from "../../api/employee.api";
import type { EmployeeResponse } from "../../api/employee.api";
import EmployeeNodeCard from "./EmployeeNodeCard";
import {
  pageContentPaperSx,
  pageHeaderPaperSx,
  pageHeaderStackSx,
  pageHeaderTitleSx,
  pageRootSx,
} from "../../components/page/pageStyles";
 
export default function EmployeeChartPage() {
  const { id } = useParams();
  const navigate = useNavigate();
 
  const [chain, setChain] = useState<EmployeeResponse[]>([]);
  const [directReports, setDirectReports] = useState<EmployeeResponse[]>([]);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    if (!id) return;
 
    const fetchData = async () => {
      try {
        setLoading(true);
 
        const [chainData, reportsData] = await Promise.all([
          getManagerialChain(Number(id)),
          getEmployeesByManagerId(Number(id)),
        ]);
 
        setChain(chainData);
        setDirectReports(reportsData);
      } catch {
        toast.error("Failed to load organization data");
      } finally {
        setLoading(false);
      }
    };
 
    fetchData();
  }, [id]);
 
  if (loading) {
    return (
      <Box sx={pageRootSx}>
        <Paper variant="outlined" sx={pageContentPaperSx}>
          <Box sx={{ p: { xs: 3, sm: 4 }, textAlign: "center" }}>
            <CircularProgress />
          </Box>
        </Paper>
      </Box>
    );
  }


  return (
    <Box sx={pageRootSx}>
      <Paper variant="outlined" sx={pageHeaderPaperSx}>
        <Stack spacing={1} alignItems="flex-start" sx={pageHeaderStackSx}>
          <Stack spacing={0.25}>
            <Typography variant="h5" sx={pageHeaderTitleSx}>
              Organization Chart
            </Typography>
            <Typography variant="body2" color="text.secondary">
              View managerial chain and direct reports.
            </Typography>
          </Stack>
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={pageContentPaperSx}>
        <Box
          sx={{
            p: { xs: 2, sm: 2.5 },
            display: "flex",
            justifyContent: "center",
            overflowX: "auto",
          }}
        >
          <Box
            sx={{
              minWidth: { xs: 320, sm: 520 },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              mb: 4,
            }}
          >
            {chain.map((employee, index) => (
              <Box
                key={employee.id}
                sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
              >
                <EmployeeNodeCard
                  {...employee}
                  isSelected={index === chain.length - 1}
                  onClick={() => navigate(`/dashboard/chart/${employee.id}`)}
                />

                {index !== chain.length - 1 && (
                  <Box sx={{ width: 2, height: 30, bgcolor: "divider", mt: 1 }} />
                )}
              </Box>
            ))}

            {directReports.length > 0 && (
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Box sx={{ width: 2, height: 30, bgcolor: "divider" }} />

                <Box
                  sx={{
                    width: "100%",
                    maxWidth: 900,
                    height: 2,
                    bgcolor: "divider",
                  }}
                />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: { xs: 2, sm: 4 },
                    mt: 2,
                    width: "100%",
                    maxWidth: 900,
                    flexWrap: "wrap",
                  }}
                >
                  {directReports.map((employee) => (
                    <Box
                      key={employee.id}
                      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
                    >
                      <Box sx={{ width: 2, height: 20, bgcolor: "divider", mb: 1 }} />

                      <EmployeeNodeCard
                        {...employee}
                        onClick={() => navigate(`/dashboard/chart/${employee.id}`)}
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
 
  );
}