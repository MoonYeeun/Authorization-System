import { FixedSizeList as List } from 'react-window';
import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import '../Layout/Layout.css'


export default function CheckboxList(props) {

    const [checked, setChecked] = React.useState([0]);
    const handleToggle = value => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
 
    if (currentIndex === -1) {
        newChecked.push(value);
    } else {
        newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

    const Row = ({index, style }) => (
    <div className={index % 2 ? "ListItemOdd" : "ListItemEven"} style={style}>
    {[index].map(value => {
        return (
        <ListItem key={value} role={undefined} dense button onClick={handleToggle(value)}>
        <Checkbox
            edge="start"
            checked={checked.indexOf(value) !== -1}
            tabIndex={-1}
            disableRipple
            inputProps={{ 'aria-labelledby': value }}
            />
        <ListItemText primary={props.user_list[index].user_name}
        secondary={props.user_list[index].user_id}></ListItemText> 
        </ListItem>   
        );     
    })} 
    </div>
    );
    const Example = () => {
        console.log('props '+props.user_list);
        return (
            <List
                className="List list"
                height={400}
                itemCount={props.user_list.length}
                itemSize={70}
                width={300}
                >
                {Row}
            </List>
        )
    }
    return ( 
        <Example />   
    );
}