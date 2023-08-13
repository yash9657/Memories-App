import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper } from '@material-ui/core';
import useStyles from './styles';
import FileBase from 'react-file-base64';
import { useDispatch, useSelector } from 'react-redux';
import { createPost, updatePost } from '../../actions/posts';

const Form = ({ currentId, setCurrentId }) => {
  const classes = useStyles();
  const post = useSelector((state) => currentId ? state.posts.find((p) => p._id === currentId) : null);
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState([]);
  // const [base64String, setBase64String] = useState("");
  const user = JSON.parse(localStorage.getItem("profile"));

  useEffect(() => {
    if(post) setPostData(post);
  }, [post])

  const [postData, setPostData] = useState({
    title: '', message: '', tags: '', selectedFile: ''
  })

  const onFileChange = (e) => {
    setSelectedFile(e.target.files);
    encodeToBase64(selectedFile[0]);
  }

  const encodeToBase64 = (file) => {
    var reader = new FileReader();
    if(file) {
      reader.readAsDataURL(file);
      reader.onload = () => {
        var base64 = reader.result;
        console.log(base64);
        setPostData({ ...postData, selectedFile: base64 });
      };
      reader.onerror = (error) => {
        console.log(error);
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if(currentId) {
      dispatch(updatePost(currentId, { ...postData, name: user?.result?.name }));
    } else {
      dispatch(createPost({ ...postData, name: user?.result?.name }));
    }
    clear();
  }

  const clear = () => {
    setCurrentId(null);
    setPostData({
      title: '', message: '', tags: '', selectedFile: ''
    });
  };

  if(!user?.result?.name) {
    return (
      <Paper className={classes.paper}>
        <Typography variant="h6" align="center">
          Please Sign In to create your memories and like other's memories.
        </Typography>
      </Paper>
    )
  }

  return (
    <Paper className={classes.paper}>
      <form autoComplete='off' noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
        <Typography variant="h6">{currentId ? 'Editing' : 'Creating'} a memory</Typography>
        <TextField 
          name="title" 
          variant="outlined" 
          label="Title" 
          fullWidth
          value={postData.title}
          onChange={(e) => setPostData({ ...postData, title: e.target.value })}
        />
        <TextField 
          name="message" 
          variant="outlined" 
          label="Message" 
          fullWidth
          value={postData.message}
          onChange={(e) => setPostData({ ...postData, message: e.target.value })}
        />
        <TextField 
          name="tags" 
          variant="outlined" 
          label="Tags" 
          fullWidth
          value={postData.tags}
          onChange={(e) => setPostData({ ...postData, tags: e.target.value.split(',') })}
        />
        <div className={classes.fileInput}>
          <input type="file" accept="image/jpeg" onChange={onFileChange} />
        </div>
        <Button className={classes.buttonSubmit} variant='container' color='primary' size='large' type='submit' fullWidth>Submit</Button>
        <Button variant='contained' color='secondary' size='small' onClick={clear} fullWidth>Clear</Button>
      </form>
    </Paper>
  )
}

export default Form