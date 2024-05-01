import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha, makeStyles } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import axios from 'axios';
import { useEffect } from 'react';
import { useCallback } from 'react';
import { useState } from 'react';

// function createData(id, name, calories, fat, carbs, protein) {
//   return {
//     id,
//     name,
//     calories,
//     fat,
//     carbs,
//     protein,
//   };
// }





// Modifier la fonction descendingComparator pour traiter les nombres et les chaînes de caractères
function descendingComparator(a, b, orderBy) {
  const is24hOrVolume = orderBy === '24h' || orderBy === 'volume';

  if (is24hOrVolume) {
    const valueA = parseFloat(a[orderBy]);
    const valueB = parseFloat(b[orderBy]);

    return valueB - valueA;
  } else {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }
}

// Modifier la fonction getComparator pour traiter les nombres et les chaînes de caractères
// Modifier la fonction getComparator pour traiter les nombres et les chaînes de caractères
function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => {
      if (orderBy === '24h' || orderBy === 'volume') {
        // Assurez-vous que les valeurs sont définies avant de les comparer
        if (!a[orderBy] || !b[orderBy]) {
          return 0;
        } else if (isNaN(parseFloat(a[orderBy])) || isNaN(parseFloat(b[orderBy]))) {
          return a[orderBy].localeCompare(b[orderBy]);
        } else {
          return parseFloat(b[orderBy]) - parseFloat(a[orderBy]);
        }
      } else {
        return descendingComparator(a, b, orderBy);
      }
    }
    : (a, b) => {
      if (orderBy === '24h' || orderBy === 'volume') {
        // Assurez-vous que les valeurs sont définies avant de les comparer
        if (!a[orderBy] || !b[orderBy]) {
          return 0;
        } else if (isNaN(parseFloat(a[orderBy])) || isNaN(parseFloat(b[orderBy]))) {
          return b[orderBy].localeCompare(a[orderBy]);
        } else {
          return parseFloat(a[orderBy]) - parseFloat(b[orderBy]);
        }
      } else {
        return -descendingComparator(a, b, orderBy);
      }
    };
}




// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'name',
  },
  {
    id: 'top3',
    numeric: false,
    disablePadding: false,
    label: 'Top 3',
  },
  {
    id: 'market_cap',
    numeric: true,
    disablePadding: false,
    label: 'Market Cap',
  },
  {
    id: '24h',
    numeric: false,
    disablePadding: false,
    label: '24h',
  },
  {
    id: 'volume',
    numeric: false,
    disablePadding: false,
    label: 'Volume',
  },
  {
    id: 'updated',
    numeric: false,
    disablePadding: false,
    label: 'Updated At',
  },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    // console.log(property)
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

// function EnhancedTableToolbar(props) {
//   const { numSelected } = props;

//   return (
//     <Toolbar
//       sx={{
//         pl: { sm: 2 },
//         pr: { xs: 1, sm: 1 },
//         ...(numSelected > 0 && {
//           bgcolor: (theme) =>
//             alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
//         }),
//       }}
//     >
//       {numSelected > 0 ? (
//         <Typography
//           sx={{ flex: '1 1 100%' }}
//           color="inherit"
//           variant="subtitle1"
//           component="div"
//         >
//           {numSelected} selected
//         </Typography>
//       ) : (
//         <Typography
//           sx={{ flex: '1 1 100%' }}
//           variant="h6"
//           id="tableTitle"
//           component="div"
//         >
//           Nutrition
//         </Typography>
//       )}

//       {numSelected > 0 ? (
//         <Tooltip title="Delete">
//           <IconButton>
//             <DeleteIcon />
//           </IconButton>
//         </Tooltip>
//       ) : (
//         <Tooltip title="Filter list">
//           <IconButton>
//             <FilterListIcon />
//           </IconButton>
//         </Tooltip>
//       )}
//     </Toolbar>
//   );
// }

// EnhancedTableToolbar.propTypes = {
//   numSelected: PropTypes.number.isRequired,
// };

export default function CategorieTable() {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('market_cap');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [tableData, setTableData] = useState([]);
  const [visibleRows, setVisibleRows] = React.useState([]);


  // const rows = [

  //   createData(2, 'Donut', 452, 25.0, 51, 4.9),
  //   createData(3, 'Eclair', 262, 16.0, 24, 6.0),
  //   createData(4, 'Frozen yoghurt', 159, 6.0, 24, 4.0),
  //   createData(5, 'Gingerbread', 356, 16.0, 49, 3.9),
  //   createData(6, 'Honeycomb', 408, 3.2, 87, 6.5),
  //   createData(7, 'Ice cream sandwich', 237, 9.0, 37, 4.3),
  //   createData(8, 'Jelly Bean', 375, 0.0, 94, 0.0),
  //   createData(9, 'KitKat', 518, 26.0, 65, 7.0),
  //   createData(10, 'Lollipop', 392, 0.2, 98, 0.0),
  //   createData(11, 'Marshmallow', 318, 0, 81, 2.0),
  //   createData(12, 'Nougat', 360, 19.0, 9, 37.0),
  //   createData(13, 'Oreo', 437, 18.0, 63, 4.0),
  // ];



  const fetchCategorie = useCallback(async () => {
    try {
      let allCategories = [];
      for (let page = 1; page <= 8; page++) {
        const response = await axios.get(`https://localhost:8000/api/categories?page=${page}`);
        const data = response.data;
        allCategories = [...allCategories, ...data['hydra:member']];
      }

      setTableData(allCategories);
      console.log(allCategories)
    } catch (err) {
      console.error(err)

    }
  })

  useEffect(() => {
    fetchCategorie()
  }, [])

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = tableData.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tableData.length) : 0;


  const rows = stableSort(tableData, getComparator(order, orderBy)).slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}
    >
      <Box sx={{ width: '85%', mt: 3 }} >
        <Paper sx={{ width: '100%', mb: 2 }}>
          {/* <EnhancedTableToolbar numSelected={selected.length} /> */}

          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={dense ? 'small' : 'medium'}
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={tableData.length}
              />
              <TableBody>
                {rows.map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                      sx={{ cursor: 'pointer' }}
                    >

                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                        align="left"
                      >
                        {row.name}
                      </TableCell>
                      <TableCell align="left">
                        {row.top3Coins.map((img, index) => (
                          <img
                            key={index}
                            src={img}
                            alt={`Coin ${index}`}
                            style={{ width: '25px', height: '25px' }} />
                        ))}
                      </TableCell>
                      <TableCell align="right">{row.market_cap}</TableCell>
                      <TableCell align="right">{row.market_cap_change_24h}</TableCell>
                      <TableCell align="right">{row.volume24h}</TableCell>
                      <TableCell align="right">{row.updated_at}</TableCell>

                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (dense ? 33 : 53) * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>


          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={tableData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        <FormControlLabel
          control={<Switch checked={dense} onChange={handleChangeDense} />}
          label="Dense padding"
        />
      </Box>
    </Box>
  );
}