import {
  Modal,
  Box,
  TextField,
  Autocomplete,
  Button,
  Chip,
} from "@mui/material";
import { CustomUser, Tag } from "@/lib/API";

interface NewMeetingProps {
  users: CustomUser[];
  selectedUsers: CustomUser[];
  setSelectedUsers: React.Dispatch<React.SetStateAction<CustomUser[]>>;
  meetingName: string;
  addMeeting: boolean;
  setMeetingName: React.Dispatch<React.SetStateAction<string>>;
  setAddMeeting: (value: boolean) => void;
  availableTags: Tag[];
  tags: Tag[];
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
  handleCreateMeeting: () => void;
}

export default function NewMeeting(props: NewMeetingProps) {
  const {
    users,
    selectedUsers,
    setSelectedUsers,
    meetingName,
    addMeeting,
    setMeetingName,
    setAddMeeting,
    availableTags,
    tags,
    setTags,
    handleCreateMeeting,
  } = props;

  return (
    <Modal open={addMeeting} onClose={() => setAddMeeting(false)}>
      <Box className="absolute top-20 left-1/2 transform -translate-x-1/2 p-6 bg-indigo-400 rounded-lg shadow-lg w-11/12 md:w-1/3">
        <h2 className="text-xl font-semibold text-gray-600 mb-4">
          Create New Meeting
        </h2>
        <form className="space-y-4">
          <TextField
            label="Meeting Name"
            variant="outlined"
            fullWidth
            value={meetingName}
            className="text-gray-600"
            onChange={(e) => setMeetingName(e.target.value)}
          />

          <Autocomplete
            multiple
            options={users}
            getOptionLabel={(option) => option.data.email as string}
            value={selectedUsers}
            onChange={(e, newValue) => setSelectedUsers(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Select Users" variant="outlined" />
            )}
          />

          <Autocomplete
            multiple
            options={availableTags}
            getOptionLabel={(option) => option.data.name}
            value={tags}
            onChange={(e, newValue) => setTags(newValue)}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => {
                const tagProps = getTagProps({ index });  // Get tag props
                const { key, ...chipProps } = tagProps;   // Destructure key and other props
            
                return (
                  <div key={key}>
                    <Chip
                      label={option.data.name}
                      {...chipProps}  // Spread remaining props (excluding 'key')
                      className={`bg-${option.data.color}-200`}
                    />
                  </div>
                );
              })
            }
            renderInput={(params) => (
              <TextField {...params} label="Tags" variant="outlined" />
            )}
          />

          <Button
            onClick={handleCreateMeeting}
            variant="contained"
            color="primary"
            fullWidth
            className="mt-4"
          >
            Create Meeting
          </Button>
        </form>
      </Box>
    </Modal>
  );
}
