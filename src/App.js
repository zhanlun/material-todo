import React from 'react';
import './App.css';
import { AppBar, Divider, Container, Toolbar, Button, IconButton, List, ListItem, ListItemText, TextField, Typography, ListItemSecondaryAction } from '@material-ui/core'
import DBHandler from './DBHandler'
import { v4 as uuidv4 } from 'uuid';
import CloseIcon from '@material-ui/icons/Close';

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      title: '',
      tasks: [],
    }

  }

  componentDidMount() {
    this.dbContext = new DBHandler("zlunTasks")
    this.dbContext
      .openDatabase()
      .then(db => this.dbContext.readAllData())
      .then(arr => {
        arr.sort((a, b) => {
          if (a.create_date < b.create_date)
            return 1
          if (a.create_date > b.create_date)
            return -1
          return 0
        })
        console.log(arr)
        this.setState({
          tasks: arr,
        })
      })

  }

  handleChange = (ev) => {
    this.setState((state) => {
      return {
        [ev.target.name]: ev.target.value,
      }
    })

    this.setState((state) => {
      return {
        errorTitle: !ev.target.value.trim() && ev.target.name === 'title',
      }
    })
  }

  handleSubmit = (ev) => {
    ev.preventDefault()

    if (!this.state.title || this.state.errorTitle) {
      return
    }

    let newTask = {
      task_id: uuidv4(),
      title: this.state.title,
      is_done: 0,
      create_date: Date.now(),
    }

    this.setState(state => {
      let newTasks = state.tasks
      console.log(newTasks)

      newTasks = [newTask, ...newTasks]
      console.log(newTasks)
      return {
        tasks: newTasks,
      }
    })

    this.dbContext
      .addData(newTask)
  }

  handleClose = (task_id) => {
    this.setState(state => {
      let newTasks = state.tasks
      newTasks = newTasks.filter(task => task.task_id !== task_id)

      return {
        tasks: newTasks,
      }
    })

    this.dbContext
      .removeData(task_id)
  }

  render() {
    return (
      <div className="App">
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" style={{margin: 'auto'}}>
              To Do
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="sm" style={{marginTop: 20}}>
          <div>
            <form noValidate autoComplete="off" onSubmit={this.handleSubmit} style={{marginBottom: 30, paddingBottom: 30}}>
              <TextField style={{ margin: 8 }} name="title" value={this.state.title} onChange={this.handleChange} fullWidth margin="normal" label="Enter Your Task" 
                error={this.state.errorTitle} helperText={this.state.errorTitle && "This is a required field."}
              />
              <Button style={{float: 'right'}} variant="contained" color="primary" type="submit">Add</Button>
            </form>

            <Divider />

            <List dense={false}>
              {
                this.state.tasks.map(task => (
                  <ListItem key={task.task_id}>
                    <ListItemText
                      primary={task.title}
                      secondary={'Created: ' + new Date(task.create_date).toLocaleString()}
                    />
                    <ListItemSecondaryAction>
                      <IconButton color="secondary" edge="end" aria-label="close" onClick={() => this.handleClose(task.task_id)}>
                        <CloseIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))
              }
            </List>
          </div>
          </Container>
      </div>
    );
  }
}

export default App;
