export function RadioSwitch(props: any) {
  return (
    <div className="form-check form-switch">
      {' '}
      <input
        className={`form-check-input ${props?.className}`}
        type="checkbox"
        onChange={() => {
          if (props?.callBack) props?.callBack(!props?.state);
          props.setState(!props?.state);
        }}
        checked={props.state}
      />{' '}
      <label className="form-check-label">{props.title}</label>{' '}
    </div>
  );
}
export function SelectOptions(props: any) {
  return (
    <select
      className={`${props?.className}`}
      onChange={(e) => {
        if (props?.callBack) props?.callBack(e.target.value);
        props.setState(e.target.value);
      }}
      value={props.state}
    >
      {' '}
      {props.options.map((level: any) => {
        return (
          <option value={level} key={level}>
            {' '}
            {level}{' '}
          </option>
        );
      })}{' '}
    </select>
  );
}
export function InputControl(props: any) {
  return (
    <div className="mb-3">
      {' '}
      <input
        type="number"
        className={`form-control ${props?.className}`}
        value={props.state}
        onChange={(e) => props.setState(e.target.value)}
        placeholder="最大文法索引"
      />{' '}
    </div>
  );
}
