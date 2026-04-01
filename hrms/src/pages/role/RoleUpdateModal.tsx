import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControlLabel,
  Checkbox,
  Stack,
  CircularProgress,
  Typography,
  Box
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { updateUserRole, getUserDetail } from "../../api/role.api";
import { toast } from "react-toastify";

type Props = {
  open: boolean;
  onClose: () => void;
  userId: number;
  onSuccess: () => void;
};

type FormValues = {
  roles: string[];
};

type RoleData = {
  name: string;
  assignedRoles: string[];
  allRoles: string[];
};

export default function RoleUpdateModal({
  open,
  onClose,
  userId,
  onSuccess
}: Props) {

  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: { roles: [] }
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [rolesData, setRolesData] = useState<RoleData | null>(null);

  useEffect(() => {
    if (open && userId) {
      setFetching(true);

      getUserDetail(userId)
        .then((res) => {
          setRolesData(res);

          reset({ roles: res.assignedRoles });
        })
        .catch(() => toast.error("Failed to load roles"))
        .finally(() => setFetching(false));
    }
  }, [open, userId, reset]);

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);

      await updateUserRole(userId, { roles: data.roles });

      toast.success("Roles updated successfully");
      onSuccess();
      onClose();

    } catch {
      toast.error("Failed to update roles");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Update Roles</DialogTitle>

      <DialogContent>

        <Typography variant="h6" mb={1}>
          {rolesData?.name}
        </Typography>

        {fetching ? (
          <Box display="flex" justifyContent="center" mt={2}>
            <CircularProgress />
          </Box>
        ) : (
          <Controller
            name="roles"
            control={control}
            render={({ field }) => (
              <Stack mt={1}>
                {rolesData?.allRoles.map((role) => {
                  const checked = field.value?.includes(role) || false;

                  return (
                    <FormControlLabel
                      key={role}
                      control={
                        <Checkbox
                          checked={checked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              field.onChange([...(field.value || []), role]);
                            } else {
                              field.onChange(
                                (field.value || []).filter((r) => r !== role)
                              );
                            }
                          }}
                        />
                      }
                      label={role}
                    />
                  );
                })}
              </Stack>
            )}
          />
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading || fetching}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          disabled={loading || fetching}
        >
          {loading ? <CircularProgress size={20} /> : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}