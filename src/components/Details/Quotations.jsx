import EmptyData from "../common/EmptyData";

const Quotations = ({ quotes = [] }) => {
  if (!quotes.length) return <EmptyData msg="There are no quotations." />;
  return (
    <div>
      {quotes.map(({ node }, qIndex) => {
        const {
          __typename,
          id,
          objectId,
          createdAt,
          updatedAt,
          ...quotationOBj
        } = node;
        return (
          <table className="table w-full text-sm" key={qIndex}>
            <tbody>
              <tr>
                <td colSpan="2">Quotation {qIndex + 1}</td>
              </tr>
              {Object.entries(quotationOBj)
                .filter(([, entry]) => !isObject(entry))
                .map(([key, entry], index) => (
                  <tr key={index}>
                    <td>{key}</td>
                    <td>{entry}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        );
      })}
    </div>
  );
};

export default Quotations;
