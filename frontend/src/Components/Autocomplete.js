import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Box, Typography } from '@mui/material';


export default function AutocompleteHint({ options, label, id }) {
  const hint = React.useRef('');
  const [inputValue, setInputValue] = React.useState('');
  return (

    < Autocomplete
      getOptionLabel={(option) => option.name.toUpperCase()}

      renderOption={(props, option) => (
        <li{...props}>
          < Box key={option.id} sx={{ display: 'flex', alignItems: 'center' }}>
            {option.image && (
              <img src={option.image} alt={option.id} style={{
                marginRight: 1,
                height: 24,
                width: 24
              }} />
            )}
            {option.name.toUpperCase()}
          </Box>
        </li>
      )
      }

      onKeyDown={(event) => {
        if (event.key === 'Tab') {
          if (hint.current) {
            setInputValue(hint.current);
            event.preventDefault();
          }
        }
      }}
      onBlur={() => {
        hint.current = '';
      }}
      disablePortal
      inputValue={inputValue}
      filterOptions={(options, state) => {
        const displayOptions = options.filter((option) =>
          option.name
            .toLowerCase()
            .trim()
            .includes(state.inputValue.toLowerCase().trim()),
        );

        return displayOptions;
      }}
      id={id}
      options={options}
      sx={{ width: 300 }}
      ListboxProps={{
        style: {
          maxHeight: 200,
          overflowY: 'auto',
        },
      }}
      renderInput={(params) => {
        return (
          <Box sx={{ position: 'relative' }}>
            <Typography
              sx={{ position: 'absolute', opacity: 0.5, left: 14, top: 16 }}
            >
              {hint.current}
            </Typography>
            <TextField
              {...params}
              onChange={(e) => {
                const newValue = e.target.value;
                setInputValue(newValue);
                const matchingOption = options.find((option) =>
                  option.name.startsWith(newValue),
                );

                if (newValue && matchingOption) {
                  hint.current = matchingOption.name;
                } else {
                  hint.current = '';
                }
              }}
              label={label}
            />
            {console.log(options)}
            {console.log(inputValue)}
          </Box>
        );
      }}
    />
  );
}

