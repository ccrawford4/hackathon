import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Chip,
  IconButton,
  Button,
  Avatar,
  Autocomplete,
  Icon,
  ButtonBase
} from '@mui/material';
import {  CustomUser, Tag } from '@/lib/API';
import { Add, Close } from '@mui/icons-material';
import { batchUpdate, createObjects, deleteObject, deleteObjects } from '@/lib/mutations';
import { Database } from 'firebase/database';

interface EditMeetingProps {
    db: Database;
    meetingTitle: string;
    meetingId: string;
    setMeetingName: React.Dispatch<React.SetStateAction<string>>;
    tags: Tag[];
    setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
    users: CustomUser[];
    open: boolean;
    onClose: () => void;
    availableTags: Tag[];
    availableUsers: CustomUser[];
}

export default function EditMeeting(props: EditMeetingProps) {
    // Initialize state with props
    const initialTags = props.tags;
    const initialUsers = props.users;
    const [tags, setTags] = useState<Tag[]>(props.tags);
    const [users, setUsers] = useState<CustomUser[]>(props.users);
    const [meetingTitle, setMeetingTitle] = useState(props.meetingTitle);
    const [newTag, setNewTag] = useState<Tag>();

    // Tag handlers
    const handleAddTag = () => {
        if (newTag && !tags.find(t => t.id === newTag.id)) {
            setTags([...tags, newTag]);
        }
    };

    const handleRemoveTag = (tagToRemove: Tag) => {
        setTags(tags.filter(tag => tag.id !== tagToRemove.id));
    };

    // User handlers
    const handleUsersChange = (newUsers: CustomUser[]) => {
        setUsers(newUsers);
    };

    const onSave = async () => {
        try {
            // Prepare all updates
            const updates = [];
            
            // Add meeting title update if changed
            if (meetingTitle !== props.meetingTitle) {
                updates.push({
                    collection: 'meetings',
                    id: props.meetingId,
                    data: { title: meetingTitle }
                });
            }
    
            // Handle tag changes
            const tagsToRemove = initialTags.filter(tag => !tags.some(t => t.id === tag.id));
            const tagsToAdd = tags.filter(tag => !initialTags.some(t => t.id === tag.id));
            
            // Handle user changes
            const usersToRemove = initialUsers.filter(user => !users.some(u => u.id === user.id));
            const usersToAdd = users.filter(user => !initialUsers.some(u => u.id === user.id));
    
            // Add tag updates
            tagsToRemove.forEach(tag => {
                updates.push({
                    collection: 'meetingTags',
                    id: `${props.meetingId}_${tag.id}`,
                    data: { active: false }  // Soft delete
                });
            });
    
            tagsToAdd.forEach(tag => {
                updates.push({
                    collection: 'meetingTags',
                    id: `${props.meetingId}_${tag.id}`,
                    data: {
                        meetingId: props.meetingId,
                        tagId: tag.id,
                        active: true
                    }
                });
            });
    
            // Add user updates
            usersToRemove.forEach(user => {
                updates.push({
                    collection: 'meetingUsers',
                    id: `${props.meetingId}_${user.id}`,
                    data: { active: false }  // Soft delete
                });
            });
    
            usersToAdd.forEach(user => {
                updates.push({
                    collection: 'meetingUsers',
                    id: `${props.meetingId}_${user.id}`,
                    data: {
                        meetingId: props.meetingId,
                        userId: user.id,
                        active: true
                    }
                });
            });
    
            // Perform all updates in a single batch
            await batchUpdate(props.db, updates);
            
            // Close the modal
            props.onClose();
        } catch (error) {
            console.error('Error saving meeting changes:', error);
            // Here you might want to show an error message to the user
            // using your preferred notification system
        }
    };

    const handleSave = async () => {
        await onSave();
        props.onClose();
    };

    return (
        <Modal
            open={props.open}
            onClose={props.onClose}
            aria-labelledby="edit-meeting-modal"
        >
            <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl">
                <Box className="bg-white rounded-lg shadow-xl p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <Typography variant="h5" component="h2" className="font-semibold">
                            Edit Meeting
                        </Typography>
                        <IconButton onClick={props.onClose}>
                            <Close className="h-5 w-5" />
                        </IconButton>
                    </div>

                    {/* Form Content */}
                    <div className="space-y-6">
                        {/* Title */}
                        <TextField
                            fullWidth
                            label="Title"
                            value={meetingTitle}
                            onChange={(e) => setMeetingTitle(e.target.value)}
                            variant="outlined"
                        />

                        {/* Tags Section */}
                        <div>
                            <Typography variant="subtitle1" className="mb-2 font-medium">
                                Tags
                            </Typography>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {tags.map((tag) => (
                                    <Chip
                                        key={tag.id}
                                        label={tag.data.name}
                                        onDelete={() => handleRemoveTag(tag)}
                                        style={{ backgroundColor: tag.data.color, color: 'white' }}
                                    />
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <Autocomplete
                                    size="small"
                                    options={props.availableTags.filter(tag => !tags.some(t => t.id === tag.id))}
                                    getOptionLabel={(option) => option.data.name}
                                    value={newTag}
                                    onChange={(_, value) => setNewTag(value || undefined)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            placeholder="Add new tag"
                                            size="small"
                                        />
                                    )}
                                />
                                <Button
                                    variant="outlined"
                                    onClick={handleAddTag}
                                    disabled={!newTag}
                                >
                                    Add Tag
                                </Button>
                            </div>
                        </div>

                        {/* Users Section */}
                        <div>
                            <Typography variant="subtitle1" className="mb-2 font-medium">
                                Participants
                            </Typography>
                            <Autocomplete
                                multiple
                                options={props.availableUsers}
                                getOptionLabel={(option) => (option.data as Tag["data"]).name}
                                value={users}
                                onChange={(_, newValue) => handleUsersChange(newValue)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        placeholder="Add participants"
                                    />
                                )}
                                renderTags={(value, getTagProps) =>
                                    value.map((user, index) => (
                                        <Chip
                                            {...getTagProps({ index })}
                                            key={user.id}
                                            avatar={<Avatar src={user.data.profileURL}/>}
                                            label={(user.data as Tag["data"]).name}
                                            variant="outlined"
                                        />
                                    ))
                                }
                            />
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-3 mt-8">
                        <Button
                            variant="outlined"
                            onClick={props.onClose}
                            className="px-6"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleSave}
                            className="px-6"
                        >
                            Save Changes
                        </Button>
                    </div>
                </Box>
            </Box>
        </Modal>
    );
}