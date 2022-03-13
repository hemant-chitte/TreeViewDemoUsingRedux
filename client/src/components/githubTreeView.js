import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getRepositories } from '../actions/repository';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';
import api from '../utils/api';
import { USER_NAME } from '../actions/types';
import Spinner from '../layout/Spinner';

const GithubTreeView = ({
  getRepositories,
  repository: { repositories, loading }
}) => {
  const [pulls, setPulls] = useState({});
  const [commits, setCommits] = useState({});
  const username = USER_NAME;

  useEffect(() => {
    getRepositories(username);
  }, []);

  // on click of repo this method will get called and will retrive all the pull requests.
  // aginst the repo name
  async function FetchPulls(username, reponame) {
    const res = await api.get(`/pulls/${username}/${reponame}`);
    console.log(res);
    setPulls({ ...pulls, [reponame]: res.data });
  }

  // on click of pull request this method will get called and will retrive all the files.
  // aginst the pull request
  async function FetchCommits(username, reponame, pullnumber, pullid) {
    const res = await api.get(`/commits/${username}/${reponame}/${pullnumber}`);
    console.log(res);
    setCommits({ ...commits, [pullid]: res.data });
  }

  return (
    <section>
      {loading ? (
        <Spinner />
      ) : (
        <TreeView
          aria-label='rich object'
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpanded={['root']}
          defaultExpandIcon={<ChevronRightIcon />}
          sx={{
            height: 500,
            flexGrow: 1,
            maxWidth: 500,
            overflowY: 'auto',
            paddingTop: '50px',
            paddingLeft: '30px',
          }}
        >
          {repositories.length > 0 ? (
            repositories.map((node) => (
              <TreeItem
                key={node.id}
                nodeId={node.id}
                label={node.name}
                onClick={() => FetchPulls(username, node.name)}
              >
                {pulls[node.name] &&
                  !!pulls[node.name].length &&
                  pulls[node.name].map((pullnode) => (
                    <TreeItem
                      key={pullnode.id}
                      nodeId={pullnode.id}
                      label={pullnode.title}
                      onClick={() =>
                        FetchCommits(
                          username,
                          node.name,
                          pullnode.number,
                          pullnode.id
                        )
                      }
                    >
                      {commits[pullnode.id] &&
                        !!commits[pullnode.id].length &&
                        commits[pullnode.id].map((commitnode) => (
                          <TreeItem
                            key={commitnode.sha}
                            nodeId={commitnode.sha}
                            label={commitnode.filename}
                          ></TreeItem>
                        ))}
                    </TreeItem>
                  ))}
              </TreeItem>
            ))
          ) : (
            <h4>No Repository Found...</h4>
          )}
        </TreeView>
      )}
      ;
    </section>
  );
};

GithubTreeView.propTypes = {
  getRepositories: PropTypes.func.isRequired,
  repository: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  repository: state.repository,
});

export default connect(mapStateToProps, { getRepositories })(GithubTreeView);
