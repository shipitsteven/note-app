import React, { Dispatch } from 'react'
import clsx from 'clsx'
import {
  alpha,
  createStyles,
  makeStyles,
  useTheme,
  Theme,
} from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import InputBase from '@material-ui/core/InputBase'
import MenuIcon from '@material-ui/icons/Menu'
import NoteIcon from '@material-ui/icons/Note'
import SearchIcon from '@material-ui/icons/Search'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import LabelRoundedIcon from '@material-ui/icons/LabelTwoTone'
import Chip from '@material-ui/core/Chip'
import Avatar from '@material-ui/core/Avatar'
import { fakeTags } from '../mock/fakeNotes'
import { SetStateAction } from 'react'
import { SimpleNotesProvider} from '../note_access'
import { FolderTree } from './FolderTree'
import {searchResult} from '../simpleSearch'
import {Note} from '../note_storage'

const drawerWidth = 380

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: 36,
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9) + 1,
      },
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    inline: {
      display: 'inline',
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: alpha(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
      },
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
      marginLeft: theme.spacing(2),
    },
    flexWrapDiv: {
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
  })
)

interface Props {
  children: React.ReactElement<any>
  preview: boolean
  noteId: string
  value: string
  handlePreview: Dispatch<SetStateAction<boolean>>
  handleNoteChange: Dispatch<SetStateAction<string>>
  handleNoteId: Dispatch<SetStateAction<string>>
}

export default function NotesDrawer(props: Props): JSX.Element {
  const classes = useStyles()
  const theme = useTheme()
  const [open, setOpen] = React.useState(false)
  const [searchKey, setSearchKey] = React.useState('')

  const handleChipOnClick = (name: string) => {
    setSearchKey('#tag ' + name)
  }

  const handleChange = (key:string)=>{
    setSearchKey(key)
  }

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            [Note Title Goes Here]
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
            </div>
            <button onClick = {()=>{
              searchResult(searchKey)
              }}>search</button>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'Search' }}
              value={searchKey}
              onChange={(event) => handleChange(event.target.value)}
            />
          </div>
          <Button
            variant="contained"
            color="secondary"
            disableElevation
            onClick={() => {
              props.handlePreview(!props.preview)
            }}
          >
            Toggle Preview
          </Button>
          <Button
            variant="contained"
            color="primary"
            disableElevation
            onClick={() => {
              const NotesProvider = new SimpleNotesProvider()
              const NoteAccess = NotesProvider.Create()
              // const note = new Note('hello', props.value)
              const note = new Note(props.noteId, props.value)
              NoteAccess.Save(note)
            }}
            style={{
              marginLeft: theme.spacing(2),
              backgroundColor: theme.palette.common.white,
              color: theme.palette.common.black,
            }}
          >
            Save
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <List>
          {open ? (
            <Accordion className="flexWrapDiv">
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <div className={classes.flexWrapDiv}>
                  <Avatar
                    style={{ color: '#189AB4', background: 'transparent' }}
                  >
                    <NoteIcon />
                  </Avatar>
                  <Typography className={classes.heading}> Notes</Typography>
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <FolderTree
                  handleChange={props.handleNoteChange}
                  handleNoteId={props.handleNoteId}
                />
              </AccordionDetails>
            </Accordion>
          ) : (
            <ListItem>
              <ListItemIcon>
                <NoteIcon />
              </ListItemIcon>
            </ListItem>
          )}
        </List>
        <Divider />

        {open ? (
          <Accordion className="flexWrapDiv">
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <div className={classes.flexWrapDiv}>
                <Avatar style={{ color: '#FF9636', background: 'transparent' }}>
                  <LabelRoundedIcon />
                </Avatar>
                <Typography className={classes.heading}> Tags</Typography>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <div className={classes.flexWrapDiv}>
                {fakeTags.map(({ name, color }) => (
                  <Chip
                    onClick={() => handleChipOnClick(name)}
                    label={name}
                    key={name}
                    style={{
                      backgroundColor: color,
                      margin: '0.25em',
                    }}
                    // TODO: add on click handler
                  />
                ))}
              </div>
            </AccordionDetails>
          </Accordion>
        ) : (
          <ListItem>
            <LabelRoundedIcon style={{ color: '#FF9636' }} />
          </ListItem>
        )}
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {props.children}
      </main>
    </div>
  )
}
