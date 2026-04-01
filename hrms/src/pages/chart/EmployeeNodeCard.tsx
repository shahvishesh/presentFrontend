import { Card, CardContent, Typography } from "@mui/material";
 
interface Props {
  id: number;
  firstName: string;
  lastName: string;
  designation: string;
  department: string;
  isSelected?: boolean;
  onClick: () => void;
}
 
export default function EmployeeNodeCard({
  firstName,
  lastName,
  designation,
  department,
  isSelected,
  onClick,
}: Props) {
  return (
    <Card
      onClick={onClick}
      sx={{
        width: 250,
        cursor: "pointer",
        border: isSelected ? "2px solid" : "",
        textAlign: "center",
        boxShadow: 3,
      }}
    >
      <CardContent>
        <Typography fontWeight={600}>
          {firstName} {lastName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {designation}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {department}
        </Typography>
      </CardContent>
    </Card>
  );
}